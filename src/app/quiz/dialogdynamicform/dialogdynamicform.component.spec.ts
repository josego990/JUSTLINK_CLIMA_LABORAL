import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { DialogDynamicFormComponent } from "./dialogdynamicform.component";
describe("DialogDynamicFormComponent", () => {
  let component: DialogDynamicFormComponent;
  let fixture: ComponentFixture<DialogDynamicFormComponent>;
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [DialogDynamicFormComponent],
      }).compileComponents();
    })
  );
  beforeEach(() => {
    fixture = TestBed.createComponent(DialogDynamicFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
