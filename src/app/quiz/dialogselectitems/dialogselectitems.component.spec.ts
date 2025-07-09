import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { DialogSelectItemsComponent } from "./dialogselectitems.component";
describe("DialogformComponent", () => {
  let component: DialogSelectItemsComponent;
  let fixture: ComponentFixture<DialogSelectItemsComponent>;
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [DialogSelectItemsComponent],
      }).compileComponents();
    })
  );
  beforeEach(() => {
    fixture = TestBed.createComponent(DialogSelectItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
