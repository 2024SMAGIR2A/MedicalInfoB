import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SecurityService } from '../Services/security.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  UserFormGroup!: FormGroup;
  loading = false;

  constructor(
    private FormBuilder: FormBuilder,
    private SecurityService: SecurityService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.InitFormGroup();
    if (this.SecurityService.CheckAuth()) {
      this.SecurityService.navigate('DashboardMedecin');
    }
  }

  InitFormGroup() {
    this.UserFormGroup = this.FormBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  async Login() {
    if (this.UserFormGroup.invalid) {
      this.snackBar.open('Please fill all required fields', 'Close', {
        duration: 3000,
        horizontalPosition: 'end',
        verticalPosition: 'top',
        panelClass: ['error-snackbar']
      });
      return;
    }

    this.loading = true;
    try {
      await this.SecurityService.Login(this.UserFormGroup.value);
    } catch (error: any) {
      this.snackBar.open(
        error.message || 'Login failed',
        'Close',
        {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'top',
          panelClass: ['error-snackbar']
        }
      );
    } finally {
      this.loading = false;
    }
  }
}
