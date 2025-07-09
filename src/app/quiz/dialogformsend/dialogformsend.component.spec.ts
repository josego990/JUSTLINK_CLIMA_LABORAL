import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { DialogformComponent } from "./dialogformsend.component";
describe("DialogformComponent", () => {
  let component: DialogformSendComponent;
  let fixture: ComponentFixture<DialogformComponent>;
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [DialogformSendComponent],
      }).compileComponents();
    })
  );
  beforeEach(() => {
    fixture = TestBed.createComponent(DialogformSendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
