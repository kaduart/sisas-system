import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { JhiPaginationUtil } from 'ng-jhipster';
import { UserRouteAccessService } from '../../shared';
import {BeneficiariosTpBombaComponent} from './beneficiarios-bmb-mecanica.component';

@Injectable()
export class BeneficiariosTpBombaResolvePagingParams implements Resolve<any> {

    constructor(private paginationUtil: JhiPaginationUtil) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const page = route.queryParams['page'] ? route.queryParams['page'] : '1';
        const sort = route.queryParams['sort'] ? route.queryParams['sort'] : 'id,asc';
        return {
            page: this.paginationUtil.parsePage(page),
            predicate: this.paginationUtil.parsePredicate(sort),
            ascending: this.paginationUtil.parseAscending(sort)
        };
    }
}

export const beneficiariosTpBombaRoute: Routes = [
    {
        path: 'ben-ft-super-bmb-mecanica-municipal',
        component: BeneficiariosTpBombaComponent,
        resolve: {
            'pagingParams': BeneficiariosTpBombaResolvePagingParams
        },
        data: {
            authorities: ['ROLE_USER', 'ROLE_ADMIN', 'ADMIN_PROVINCIAL'],
            pageTitle: 'relatorios.title.benef-agua-fonte-subterranea-mecanica'
        },
        canActivate: [UserRouteAccessService]
    }
];
