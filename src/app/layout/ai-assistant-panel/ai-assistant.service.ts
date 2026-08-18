import { Injectable } from '@angular/core';
import axios, { AxiosRequestConfig } from 'axios';
import { AuthService } from '../../core/service/auth.service';
import {
  AiAssistantArchiveResponse,
  AiAssistantChatRequest,
  AiAssistantChatResponse,
  AiAssistantConversationResponse,
} from './ai-assistant.models';

@Injectable({
  providedIn: 'root',
})
export class AiAssistantService {
  //private readonly baseUrl = 'https://api.justlink360.net/'; //producción

   private readonly baseUrl = 'http://localhost:3030/'; //local

  constructor(private authService: AuthService) {}

  async sendMessage(payload: AiAssistantChatRequest): Promise<AiAssistantChatResponse> {
    const response = await axios.post<AiAssistantChatResponse>(
      this.endpoint('api/asistente-ia/chat'),
      payload,
      this.requestConfig(120000)
    );

    return response.data;
  }

  async getConversation(
    conversationId: string,
    organizationId: number | null
  ): Promise<AiAssistantConversationResponse> {
    const response = await axios.get<AiAssistantConversationResponse>(
      this.endpoint(`api/asistente-ia/conversaciones/${encodeURIComponent(conversationId)}`),
      {
        ...this.requestConfig(30000),
        params: organizationId ? { organizacionId: organizationId } : undefined,
      }
    );

    return response.data;
  }

  async archiveConversation(
    conversationId: string,
    organizationId: number | null
  ): Promise<AiAssistantArchiveResponse> {
    const response = await axios.delete<AiAssistantArchiveResponse>(
      this.endpoint(`api/asistente-ia/conversaciones/${encodeURIComponent(conversationId)}`),
      {
        ...this.requestConfig(30000),
        params: organizationId ? { organizacionId: organizationId } : undefined,
      }
    );

    return response.data;
  }

  private requestConfig(timeout: number): AxiosRequestConfig {
    const token = this.authService.currentUserValue?.token;

    return {
      timeout,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    };
  }

  private endpoint(path: string): string {
    return `${this.baseUrl}${path.replace(/^\/+/, '')}`;
  }
}
