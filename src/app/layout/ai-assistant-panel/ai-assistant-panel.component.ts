import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  SecurityContext,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { RightSidebarService } from '@core';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { AuthService } from '../../core/service/auth.service';
import { OrganizacionService } from '../../organization/services/organizacion.service';
import {
  AiAssistantChatRequest,
  AiAssistantChatData,
  AiAssistantHistoryMessage,
  AiAssistantModuleContext,
} from './ai-assistant.models';
import { AiAssistantService } from './ai-assistant.service';

interface AssistantMessage {
  id: number;
  role: 'assistant' | 'user';
  text: string;
  html?: string;
  isTyping?: boolean;
  tone?: 'premium' | 'warning' | 'error';
  label?: string;
}

@Component({
  selector: 'app-ai-assistant-panel',
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
  ],
  templateUrl: './ai-assistant-panel.component.html',
  styleUrls: ['./ai-assistant-panel.component.scss'],
})
export class AiAssistantPanelComponent
  extends UnsubscribeOnDestroyAdapter
  implements OnInit
{
  @ViewChild('conversation') conversation?: ElementRef<HTMLDivElement>;

  isOpen = false;
  isSending = false;
  isLoadingHistory = false;
  isArchiving = false;
  isTyping = false;
  messageText = '';
  readonly maxMessageLength = 2000;
  messages: AssistantMessage[] = [];

  private nextMessageId = 1;
  private conversationId: string | null = null;
  private activeOrganizationId: number | null = null;
  private loadedStorageKey: string | null = null;
  private typingGeneration = 0;

  constructor(
    private rightSidebarService: RightSidebarService,
    private assistantService: AiAssistantService,
    private organizationService: OrganizacionService,
    private authService: AuthService,
    private router: Router,
    private sanitizer: DomSanitizer
  ) {
    super();
    this.activeOrganizationId = this.resolveOrganizationId();
    this.resetMessages();
  }

  ngOnInit(): void {
    this.subs.sink = this.rightSidebarService.sidebarState.subscribe((isSettingsOpen) => {
      if (isSettingsOpen) {
        this.isOpen = false;
      }
    });

    this.subs.sink = this.organizationService.selectedOrganization$.subscribe((organization) => {
      const organizationId = organization?.Id ?? this.authService.currentUserValue?.idOrganization ?? null;

      if (organizationId === this.activeOrganizationId) {
        return;
      }

      this.activeOrganizationId = organizationId;
      this.conversationId = null;
      this.loadedStorageKey = null;
      this.resetMessages();

      if (this.isOpen) {
        void this.restoreConversation();
      }
    });
  }

  togglePanel(): void {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.rightSidebarService.setRightSidebar(false);
      void this.restoreConversation();
    }
  }

  closePanel(): void {
    this.isOpen = false;
  }

  @HostListener('document:keydown.escape')
  handleEscapeKey(): void {
    if (this.isOpen) {
      this.closePanel();
    }
  }

  async sendMessage(): Promise<void> {
    const message = this.messageText.trim();
    if (!message || this.isBusy) {
      return;
    }

    this.addMessage('user', message);
    this.messageText = '';
    this.isSending = true;
    this.scrollConversationToBottom();
    const requestStorageKey = this.getConversationStorageKey();

    try {
      const response = await this.assistantService.sendMessage(this.buildRequest(message));
      const responseConversationId = response?.data?.conversationId;

      if (requestStorageKey !== this.getConversationStorageKey()) {
        return;
      }

      if (responseConversationId) {
        this.conversationId = responseConversationId;
        this.persistConversationId(responseConversationId);
      }

      this.isSending = false;
      await this.addAssistantResponse(response?.data);
    } catch (error) {
      this.addApiErrorMessage(error);
    } finally {
      this.isSending = false;
      this.scrollConversationToBottom();
    }
  }

  handleComposerKeydown(event: KeyboardEvent): void {
    if (event.key !== 'Enter' || event.shiftKey) {
      return;
    }

    event.preventDefault();
    void this.sendMessage();
  }

  async startNewConversation(): Promise<void> {
    if (this.isBusy) {
      return;
    }

    if (!this.conversationId) {
      this.clearStoredConversation();
      this.resetMessages();
      return;
    }

    this.isArchiving = true;

    try {
      await this.assistantService.archiveConversation(
        this.conversationId,
        this.activeOrganizationId
      );
      this.clearStoredConversation();
      this.resetMessages();
    } catch (error) {
      this.addApiErrorMessage(error, 'No fue posible iniciar una conversación nueva.');
    } finally {
      this.isArchiving = false;
      this.scrollConversationToBottom();
    }
  }

  trackMessage(_index: number, message: AssistantMessage): number {
    return message.id;
  }

  get isBusy(): boolean {
    return this.isSending || this.isLoadingHistory || this.isArchiving || this.isTyping;
  }

  get showLoadingStatus(): boolean {
    return this.isSending || this.isLoadingHistory || this.isArchiving;
  }

  private async restoreConversation(): Promise<void> {
    const storageKey = this.getConversationStorageKey();

    if (this.loadedStorageKey === storageKey || this.isLoadingHistory) {
      this.scrollConversationToBottom();
      return;
    }

    this.loadedStorageKey = storageKey;
    const storedConversationId = sessionStorage.getItem(storageKey);

    if (!storedConversationId) {
      this.scrollConversationToBottom();
      return;
    }

    this.isLoadingHistory = true;

    try {
      const response = await this.assistantService.getConversation(
        storedConversationId,
        this.activeOrganizationId
      );

      if (storageKey !== this.getConversationStorageKey()) {
        return;
      }

      const history = response?.data;
      const messages = (history?.messages ?? [])
        .map((message) => this.mapHistoryMessage(message))
        .filter((message): message is AssistantMessage => message !== null);

      this.conversationId = history?.conversation?.conversationId || storedConversationId;
      this.messages = messages.length ? messages : this.createWelcomeMessages();
      this.syncNextMessageId();
    } catch (error) {
      if (storageKey !== this.getConversationStorageKey()) {
        return;
      }

      const code = this.getApiError(error).code;

      if (['AI_CONVERSATION_NOT_FOUND', 'AI_CONVERSATION_FORBIDDEN', 'AI_CONVERSATION_ARCHIVED'].includes(code)) {
        this.clearStoredConversation();
        this.resetMessages();
      }

      this.addApiErrorMessage(error, 'No fue posible recuperar la conversación anterior.');
    } finally {
      this.isLoadingHistory = false;

      if (storageKey !== this.getConversationStorageKey() && this.isOpen) {
        void this.restoreConversation();
        return;
      }

      this.scrollConversationToBottom();
    }
  }

  private buildRequest(message: string): AiAssistantChatRequest {
    const route = this.router.url.split(/[?#]/)[0] || null;
    const queryParams = this.router.parseUrl(this.router.url).queryParams;

    return {
      conversationId: this.conversationId,
      message,
      moduleContext: this.resolveModuleContext(route),
      route,
      organizacionId: this.activeOrganizationId,
      entityContext: {
        idModelo: this.readPositiveId(queryParams, ['idModelo', 'IdModelo', 'modelId']),
        idFlujo: this.readPositiveId(queryParams, ['idFlujo', 'IdFlujo', 'flowId']),
      },
      locale: this.resolveLocale(),
    };
  }

  private resolveModuleContext(route: string | null): AiAssistantModuleContext {
    const normalizedRoute = String(route || '').toLowerCase();

    if (normalizedRoute.includes('desempeno')) {
      return 'DESEMPENO';
    }

    if (
      normalizedRoute.includes('clima') ||
      normalizedRoute.includes('quiz') ||
      normalizedRoute.includes('dashboard1')
    ) {
      return 'CLIMA';
    }

    return 'GENERAL';
  }

  private resolveLocale(): string {
    const language = String(localStorage.getItem('lang') || 'es').trim();
    return /^[a-z]{2}(?:-[A-Z]{2})?$/.test(language) ? language : 'es';
  }

  private resolveOrganizationId(): number | null {
    const organizationId = Number(
      this.organizationService.selectedOrganizationSnapshot?.Id ??
      this.authService.currentUserValue?.idOrganization
    );

    return Number.isInteger(organizationId) && organizationId > 0 ? organizationId : null;
  }

  private readPositiveId(
    queryParams: Record<string, unknown>,
    names: string[]
  ): number | null {
    for (const name of names) {
      const value = Number(queryParams[name]);
      if (Number.isInteger(value) && value > 0) {
        return value;
      }
    }

    return null;
  }

  private mapHistoryMessage(message: AiAssistantHistoryMessage): AssistantMessage | null {
    const text = String(message?.content || '').trim();
    const role = String(message?.role || '').toUpperCase();

    if (!text || !['USER', 'ASSISTANT'].includes(role)) {
      return null;
    }

    const isHtmlResponse = String(message?.contentFormat || '').toLowerCase() === 'html'
      || this.looksLikeHtml(text);
    const assistantHtml = role === 'ASSISTANT' && isHtmlResponse
      ? this.sanitizeAssistantHtml(text)
      : '';
    const contentText = String(message?.contentText || '').trim();

    return {
      id: this.nextMessageId++,
      role: role === 'USER' ? 'user' : 'assistant',
      text: assistantHtml ? contentText || this.extractTextFromHtml(assistantHtml) : text,
      ...(assistantHtml ? { html: assistantHtml } : {}),
    };
  }

  private async addAssistantResponse(data?: AiAssistantChatData): Promise<void> {
    const rawAnswer = String(data?.answer || '').trim();
    const answerFormat = String(data?.answerFormat || '').toLowerCase();
    const shouldRenderHtml = answerFormat === 'html' || this.looksLikeHtml(rawAnswer);
    const safeHtml = shouldRenderHtml ? this.sanitizeAssistantHtml(rawAnswer) : '';
    const fallbackText = String(data?.answerText || '').trim()
      || (safeHtml ? this.extractTextFromHtml(safeHtml) : rawAnswer)
      || 'No se recibió una respuesta del asistente.';
    const message: AssistantMessage = {
      id: this.nextMessageId++,
      role: 'assistant',
      text: safeHtml ? fallbackText : '',
      ...(safeHtml ? { html: '' } : {}),
      isTyping: true,
    };
    const generation = ++this.typingGeneration;

    this.messages.push(message);
    this.isTyping = true;
    this.scrollConversationToBottom();

    try {
      if (this.prefersReducedMotion()) {
        message.text = fallbackText;
        if (safeHtml) {
          message.html = safeHtml;
        }
        return;
      }

      if (safeHtml) {
        await this.animateHtmlResponse(message, safeHtml, generation);
      } else {
        await this.animateTextResponse(message, fallbackText, generation);
      }
    } finally {
      if (generation === this.typingGeneration) {
        message.text = fallbackText;
        if (safeHtml) {
          message.html = safeHtml;
        }
        message.isTyping = false;
        this.isTyping = false;
      }
    }
  }

  private async animateHtmlResponse(
    message: AssistantMessage,
    safeHtml: string,
    generation: number
  ): Promise<void> {
    const template = document.createElement('template');
    template.innerHTML = safeHtml;
    const totalCharacters = template.content.textContent?.length ?? 0;

    if (!totalCharacters) {
      message.html = safeHtml;
      return;
    }

    const charactersPerTick = Math.max(1, Math.ceil(totalCharacters / 320));
    let tick = 0;

    for (let visibleCharacters = charactersPerTick;
      visibleCharacters < totalCharacters;
      visibleCharacters += charactersPerTick) {
      if (generation !== this.typingGeneration) {
        return;
      }

      message.html = this.revealHtml(template.content, visibleCharacters);
      if (tick++ % 4 === 0) {
        this.scrollConversationToBottom();
      }
      await this.delay(18);
    }
  }

  private async animateTextResponse(
    message: AssistantMessage,
    text: string,
    generation: number
  ): Promise<void> {
    const charactersPerTick = Math.max(1, Math.ceil(text.length / 320));
    let tick = 0;

    for (let visibleCharacters = charactersPerTick;
      visibleCharacters < text.length;
      visibleCharacters += charactersPerTick) {
      if (generation !== this.typingGeneration) {
        return;
      }

      message.text = text.slice(0, visibleCharacters);
      if (tick++ % 4 === 0) {
        this.scrollConversationToBottom();
      }
      await this.delay(18);
    }
  }

  private revealHtml(source: DocumentFragment, visibleCharacters: number): string {
    const output = document.createElement('div');
    const state = { consumed: 0, visible: visibleCharacters };

    source.childNodes.forEach((node) => {
      const revealedNode = this.cloneRevealedNode(node, state);
      if (revealedNode) {
        output.appendChild(revealedNode);
      }
    });

    return output.innerHTML;
  }

  private cloneRevealedNode(
    source: Node,
    state: { consumed: number; visible: number }
  ): Node | null {
    if (state.consumed >= state.visible) {
      return null;
    }

    if (source.nodeType === Node.TEXT_NODE) {
      const value = source.textContent || '';
      const available = state.visible - state.consumed;
      const revealed = value.slice(0, available);
      state.consumed += revealed.length;
      return document.createTextNode(revealed);
    }

    if (source.nodeType !== Node.ELEMENT_NODE) {
      return null;
    }

    const element = source as HTMLElement;
    const clone = element.cloneNode(false) as HTMLElement;

    if (['BR', 'HR'].includes(element.tagName)) {
      return clone;
    }

    element.childNodes.forEach((child) => {
      const revealedChild = this.cloneRevealedNode(child, state);
      if (revealedChild) {
        clone.appendChild(revealedChild);
      }
    });

    return clone.hasChildNodes() ? clone : null;
  }

  private sanitizeAssistantHtml(html: string): string {
    return this.sanitizer.sanitize(SecurityContext.HTML, html) || '';
  }

  private extractTextFromHtml(html: string): string {
    const template = document.createElement('template');
    template.innerHTML = html;
    return String(template.content.textContent || '').trim();
  }

  private looksLikeHtml(value: string): boolean {
    return /<([a-z][a-z0-9]*)\b[^>]*>/i.test(value);
  }

  private prefersReducedMotion(): boolean {
    return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
  }

  private delay(milliseconds: number): Promise<void> {
    return new Promise((resolve) => window.setTimeout(resolve, milliseconds));
  }

  private addApiErrorMessage(error: any, fallback?: string): void {
    const apiError = this.getApiError(error);
    const messages: Record<string, Pick<AssistantMessage, 'text' | 'tone' | 'label'>> = {
      AI_PREMIUM_REQUIRED: {
        tone: 'premium',
        label: 'Función Premium',
        text: 'El Asistente IA está disponible mediante activación en un plan Premium. Para habilitarlo en tu organización, contacta al administrador de Justlink-360. Con gusto te ayudaremos a incorporar esta experiencia a tu equipo.',
      },
      AI_QUERY_OUT_OF_SCOPE: {
        tone: 'warning',
        label: 'Consulta fuera de alcance',
        text: apiError.message || 'Puedo ayudarte únicamente con clima organizacional, evaluación de desempeño y el uso relacionado de Justlink-360.',
      },
      AI_RATE_LIMITED: {
        tone: 'warning',
        label: 'Espera un momento',
        text: 'Has enviado varias consultas en poco tiempo. Espera un momento antes de volver a intentarlo.',
      },
      AI_DAILY_TOKEN_LIMIT: {
        tone: 'warning',
        label: 'Límite diario alcanzado',
        text: 'La organización alcanzó el límite diario del asistente. Podrás continuar cuando el presupuesto se renueve.',
      },
      ORGANIZACION_NO_AUTORIZADA: {
        tone: 'error',
        label: 'Organización no autorizada',
        text: 'La organización seleccionada no está autorizada para tu sesión. Verifica la empresa activa en el encabezado.',
      },
      AI_CLASSIFIER_UNAVAILABLE: {
        tone: 'error',
        label: 'Servicio temporalmente no disponible',
        text: 'No fue posible validar el alcance de la consulta en este momento. Inténtalo nuevamente en unos minutos.',
      },
      AI_PROVIDER_UNAVAILABLE: {
        tone: 'error',
        label: 'Servicio temporalmente no disponible',
        text: 'El proveedor de IA no está disponible temporalmente. Inténtalo nuevamente en unos minutos.',
      },
      AI_DATABASE_NOT_READY: {
        tone: 'error',
        label: 'Configuración pendiente',
        text: 'El asistente todavía no está habilitado completamente en el servidor. Contacta al administrador del sistema.',
      },
      TOKEN_REQUIRED: {
        tone: 'error',
        label: 'Sesión requerida',
        text: 'Tu sesión no está disponible. Inicia sesión nuevamente para usar el asistente.',
      },
      TOKEN_INVALID: {
        tone: 'error',
        label: 'Sesión no válida',
        text: 'Tu sesión ya no es válida. Inicia sesión nuevamente para continuar.',
      },
    };
    const knownMessage = messages[apiError.code];

    this.messages.push({
      id: this.nextMessageId++,
      role: 'assistant',
      tone: knownMessage?.tone ?? 'error',
      label: knownMessage?.label ?? 'No fue posible procesar la consulta',
      text: knownMessage?.text || fallback || apiError.message || 'Inténtalo nuevamente en unos minutos.',
    });
  }

  private getApiError(error: any): { code: string; message: string; status: number | null } {
    const body = error?.response?.data ?? error?.error ?? {};
    return {
      code: String(body?.code || error?.code || ''),
      message: String(body?.message || error?.message || ''),
      status: Number(error?.response?.status ?? error?.status) || null,
    };
  }

  private addMessage(role: AssistantMessage['role'], text: string): void {
    this.messages.push({ id: this.nextMessageId++, role, text });
  }

  private createWelcomeMessages(): AssistantMessage[] {
    return [{
      id: this.nextMessageId++,
      role: 'assistant',
      text: 'Hola. Cuéntame qué necesitas construir o analizar en los módulos de clima y desempeño.',
    }];
  }

  private resetMessages(): void {
    this.typingGeneration += 1;
    this.isTyping = false;
    this.nextMessageId = 1;
    this.messages = this.createWelcomeMessages();
  }

  private syncNextMessageId(): void {
    this.nextMessageId = Math.max(0, ...this.messages.map((message) => message.id)) + 1;
  }

  private persistConversationId(conversationId: string): void {
    const storageKey = this.getConversationStorageKey();
    sessionStorage.setItem(storageKey, conversationId);
    this.loadedStorageKey = storageKey;
  }

  private clearStoredConversation(): void {
    sessionStorage.removeItem(this.getConversationStorageKey());
    this.conversationId = null;
    this.loadedStorageKey = this.getConversationStorageKey();
  }

  private getConversationStorageKey(): string {
    const userId = this.authService.currentUserValue?.userId ?? this.authService.currentUserValue?.id ?? 'user';
    return `justlink.aiAssistantConversationId.${userId}.${this.activeOrganizationId ?? 'default'}`;
  }

  private scrollConversationToBottom(): void {
    window.setTimeout(() => {
      const element = this.conversation?.nativeElement;
      if (element) {
        element.scrollTop = element.scrollHeight;
      }
    });
  }
}
