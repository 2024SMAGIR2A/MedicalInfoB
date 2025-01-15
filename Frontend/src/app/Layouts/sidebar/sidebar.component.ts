import { Component } from '@angular/core';
import { EnumRole } from 'src/app/Enum/enum-role';
import { UserModel } from 'src/app/Models/user-model.model';
import { SecurityService } from 'src/app/Services/security.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {

  constructor(

    public SecurityService : SecurityService

  )
  {

  }

  CurrentUser! : UserModel
  EnumRole = EnumRole
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.CurrentUser=this.SecurityService.GetCurrentUser()
    console.log(this.CurrentUser)
  }

}
