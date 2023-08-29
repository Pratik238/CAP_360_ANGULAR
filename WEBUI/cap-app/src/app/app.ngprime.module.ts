import { MegaMenuModule } from 'primeng/megamenu';
import { ToolbarModule } from 'primeng/toolbar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { SidebarModule } from 'primeng/sidebar';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { CardModule } from 'primeng/card';
import { MessageModule } from 'primeng/message';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { PanelModule } from 'primeng/panel';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { NgModule } from '@angular/core';
import { TooltipModule } from 'primeng/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NgxEditorModule } from 'ngx-editor';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';

import { MatCheckboxModule } from '@angular/material/checkbox';
import {MenubarModule} from 'primeng/menubar';
import { MultiSelectModule } from 'primeng/multiselect';
import { EditorModule } from 'primeng/editor';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { DialogModule } from 'primeng/dialog';
import { FileUploadModule } from 'primeng/fileupload';
import { InputNumberModule } from 'primeng/inputnumber';
import { VirtualScrollerModule } from 'primeng/virtualscroller';
import {AccordionModule} from 'primeng/accordion';



@NgModule({
    exports: [
        InputTextModule,
        ButtonModule,
        PanelModule,
        ToastModule,
        MegaMenuModule,
        MenubarModule,
        TableModule,
        MessageModule,
        CardModule,
        ProgressSpinnerModule,
        OverlayPanelModule,
        SidebarModule,
        DynamicDialogModule,
        InputTextareaModule,
        RadioButtonModule,
        ConfirmDialogModule,
        TooltipModule,
        ToolbarModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        NgxEditorModule,
        MatSlideToggleModule,
        MatToolbarModule,
        MatSidenavModule,
        MatListModule,
        MatIconModule,
        MatTableModule,
        MatMenuModule,
        MatTooltipModule,
        MatCheckboxModule,
        MultiSelectModule,
        EditorModule,
        DropdownModule,
        CalendarModule,
        DialogModule,
        FileUploadModule,
        InputNumberModule,
        VirtualScrollerModule,
        AccordionModule
    ]
})
export class NgPrimeModule { }
