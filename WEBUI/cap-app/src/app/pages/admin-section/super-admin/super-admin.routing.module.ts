import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CenterAdminComponent } from './center-admin/center-admin.component';
import { CreateFranchiseComponent } from './create-franchise/create-franchise.component';
import { MailSettingsComponent } from './mail-settings/mail-settings.component';
import { SuperAdminComponent } from './super-admin.component';

const routes: Routes = [
    {
        path: '',
        redirectTo: 'super-admin'
    },
    {
        path: 'super-admin',
        component: SuperAdminComponent,
        children: [
            {
                path: 'franchise',
                component: CreateFranchiseComponent,
            },
            {
                path: 'center-admin',
                component: CenterAdminComponent,
            },
            {
                path: 'mail-settings',
                component: MailSettingsComponent,
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SuperAdminRoutingModule { }

export const routedComponents = [
    SuperAdminComponent,
    CreateFranchiseComponent,
    CenterAdminComponent,
    MailSettingsComponent
 ];
