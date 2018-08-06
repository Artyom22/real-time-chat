import { TestBed, async, inject } from "@angular/core/testing";

import { IsLoggedInAuthPageGuard } from "./is-logged-in-auth-page.guard";

describe("IsLoggedInAuthPageGuard", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ IsLoggedInAuthPageGuard ]
    });
  });

  it("should ...", inject([ IsLoggedInAuthPageGuard ], (guard: IsLoggedInAuthPageGuard) => {
    expect(guard).toBeTruthy();
  }));
});
