import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SisasSharedModule } from '../../shared/index';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import {KuanzaNorteComponent} from './kuanzaNorte.component';
import {kuanzaNorteRoute, KuanzaNorteResolvePagingParams} from './kuanzaNorte.route';
import {LeafletModule} from '@asymmetrik/ngx-leaflet';

const ENTITY_STATES = [
    ...kuanzaNorteRoute
];

@NgModule({
    imports: [
        SisasSharedModule,
        ChartsModule,
        LeafletModule,
        RouterModule.forChild(ENTITY_STATES)
    ],
    declarations: [
        KuanzaNorteComponent
    ],
    entryComponents: [
        KuanzaNorteComponent
    ],
    providers: [
        KuanzaNorteResolvePagingParams
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SisasKuanzaNorteAguaNaoFuncionamModule {}
