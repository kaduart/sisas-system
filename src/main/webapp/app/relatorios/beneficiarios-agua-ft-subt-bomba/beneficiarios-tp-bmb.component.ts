import { Component, OnInit } from '@angular/core';
import { JhiAlertService } from 'ng-jhipster';
import { UserService } from '../../shared/user/user.service';
import { HttpResponse } from '@angular/common/http';
import { User } from '../../shared/user/user.model';
import { Principal } from '../../shared/auth/principal.service';
import {RelatoriosService} from '../relatorios.service';
import {DadosRelatorio} from '../cobertura-sector-agua/dadosRelatorio.model';
import {BeneficiariosBmbMecanica} from './beneficiarios-tp-bmb.model';

@Component({
    selector: 'jhi-benef-opt-tecnica',
    templateUrl: './beneficiarios-tp-bmb.component.html',
    styleUrls: [
        'beneficiarios-tp-bmb.css'
    ]
})

export class BeneficiariosTpBombaComponent implements OnInit {

    user: User;
    listaTabela: BeneficiariosBmbMecanica[];
    tipoRelatorio: string;
    predicate: any;
    reverse: any;
    chart: any;
    listaFuncionam: DadosRelatorio[];
    listaNaoFuncionam: DadosRelatorio[];
    listaNumSistemas: DadosRelatorio[];

    totalPopulacao = 0;
    totalPocoMelhorado = 0;
    totalFuro = 0;
    totalNascente = 0;

    totalAfridevPopulacao = 0;
    totalAfridev= 0;

    totalVergnetPopulacao = 0;
    totalVergnet = 0;

    totalVolantaPopulacao = 0;
    totalVolanta = 0;

    totalIndiaPopulacao = 0;
    totalIndia = 0;

    totalOutro = 0;
    totalOutroPopulacao = 0;

    totalGravidade = 0;
    totalGravidadePopulacao = 0;

    constructor(
        private jhiAlertService: JhiAlertService,
        private userService: UserService,
        private principal: Principal,
        private relatorioService: RelatoriosService,
    ) {}

    ngOnInit() {
        this.principal.identity().then((userIdentity) => {
            this.user = userIdentity;
        });
        this.tipoRelatorio = null;
    }

    validaTipoRelatorio() {
        if (this.tipoRelatorio === 'Nível Municipal') {
            this.buscaDadosTabela();
        }
        if (this.tipoRelatorio === 'Nível Comunal') {
            this.buscaDadosTabela();
        }
    }

    voltarEscolha() {
        this.tipoRelatorio = null;
    }

    buscaDadosTabela() {
        this.relatorioService.buscaDadosFuncAguaChafariz().subscribe(
            (res: HttpResponse<BeneficiariosBmbMecanica[]>) => {
                this.listaTabela = res.body;
                console.log(this.listaTabela);

                this.listaNaoFuncionam = new Array();
                this.listaFuncionam = new Array();
                this.listaNumSistemas = new Array();

                this.listaTabela.forEach( (i) => {
                    const item: DadosRelatorio = new DadosRelatorio();
                });
            });
    }

    sort() {
        const result = [this.predicate + ',' + (this.reverse ? 'asc' : 'desc')];
        if (this.predicate !== 'id') {
            result.push('id');
        }
        return result;
    }

}