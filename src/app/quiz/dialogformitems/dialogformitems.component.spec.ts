import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { DialogformItemsComponent } from "./dialogformitems.component";
describe("DialogformComponent", () => {
  let component: DialogformItemsComponent;
  let fixture: ComponentFixture<DialogformItemsComponent>;
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [DialogformItemsComponent],
      }).compileComponents();
    })
  );
  beforeEach(() => {
    fixture = TestBed.createComponent(DialogformItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
