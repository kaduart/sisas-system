import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {HttpErrorResponse, HttpResponse} from '@angular/common/http';

import {Observable} from 'rxjs/Observable';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {JhiAlertService, JhiEventManager} from 'ng-jhipster';

import {IndicadorProducao} from './indicador-producao.model';
import {IndicadorProducaoPopupService} from './indicador-producao-popup.service';
import {IndicadorProducaoService} from './indicador-producao.service';
import {Situacao, SituacaoService} from '../situacao';
import {SistemaAgua, SistemaAguaService} from '../sistema-agua';
import {Comuna, ComunaService} from '../comuna';
import {Provincia, ProvinciaService} from '../provincia';
import {Municipio, MunicipioService} from '../municipio';

@Component({
    selector: 'jhi-indicador-producao-dialog',
    templateUrl: './indicador-producao-dialog.component.html'
})
export class IndicadorProducaoDialogComponent implements OnInit {

    indicadorProducao: IndicadorProducao;

    isSaving: boolean;

    situacaos: Situacao[];

    sistemaaguas: SistemaAgua[];

    comunas: Comuna[];
    provincias: Provincia[];
    municipios: Municipio[];
    dtLancamentoDp: any;
    dtUltimaAlteracaoDp: any;
    routeSub: any;

    constructor(
        private jhiAlertService: JhiAlertService,
        private indicadorProducaoService: IndicadorProducaoService,
        private situacaoService: SituacaoService,
        private sistemaAguaService: SistemaAguaService,
        private comunaService: ComunaService,
        private municipioService: MunicipioService,
        private provinciaService: ProvinciaService,
        private eventManager: JhiEventManager,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.isSaving = false;

        this.routeSub = this.route.params.subscribe((params) => {
            if (params['id']) {
                this.load(params['id']);
            } else {
                this.indicadorProducao = new IndicadorProducao();
            }
        });

        this.situacaoService.query()
            .subscribe((res: HttpResponse<Situacao[]>) => {
                this.situacaos = res.body;
            }, (res: HttpErrorResponse) => this.onError(res.message));
        this.sistemaAguaService.query()
            .subscribe((res: HttpResponse<SistemaAgua[]>) => {
                this.sistemaaguas = res.body;
            }, (res: HttpErrorResponse) => this.onError(res.message));

        this.comunaService.query()
            .subscribe((res: HttpResponse<Comuna[]>) => {
                this.comunas = res.body;
            }, (res: HttpErrorResponse) => this.onError(res.message));

        this.municipioService.query().subscribe(
            (res: HttpResponse<Municipio[]>) => {
                this.municipios = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message));

        this.provinciaService.query().subscribe(
            (res: HttpResponse<Provincia[]>) => {
                this.provincias = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message));

         this.findLastIndicador();

    }

    load(id) {
        this.indicadorProducaoService.find(id)
            .subscribe((indicadorResponse: HttpResponse<IndicadorProducao>) => {
                const indicadorProducao: IndicadorProducao = indicadorResponse.body;
                if (indicadorProducao.dtLancamento) {
                    indicadorProducao.dtLancamento = {
                        year: indicadorProducao.dtLancamento.getFullYear(),
                        month: indicadorProducao.dtLancamento.getMonth() + 1,
                        day: indicadorProducao.dtLancamento.getDate()
                    };
                }
                if (indicadorProducao.dtUltimaAlteracao) {
                    indicadorProducao.dtUltimaAlteracao = {
                        year: indicadorProducao.dtUltimaAlteracao.getFullYear(),
                        month: indicadorProducao.dtUltimaAlteracao.getMonth() + 1,
                        day: indicadorProducao.dtUltimaAlteracao.getDate()
                    };
                }
                this.indicadorProducao = indicadorProducao;
            });
    }

    save() {
        // TEMPORARIO, APENAS PARA TESTE
            this.indicadorProducao.qtdAcoesFormacaoRealizadas = 0;
            this.indicadorProducao.qtdManuaisPrevistos = 0;
            this.indicadorProducao.vlrCustoTotaisCapexOpex = 0;
            this.indicadorProducao.situacao = new Situacao();
            this.indicadorProducao.situacao.id = 1;
        this.isSaving = true;
        if (this.indicadorProducao.id !== undefined) {
            this.subscribeToSaveResponse(
                this.indicadorProducaoService.update(this.indicadorProducao));
        } else {
            this.subscribeToSaveResponse(
                this.indicadorProducaoService.create(this.indicadorProducao));
        }

    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<IndicadorProducao>>) {
        result.subscribe((res: HttpResponse<IndicadorProducao>) =>
            this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess(result: IndicadorProducao) {
        this.eventManager.broadcast({name: 'indicadorProducaoListModification', content: 'OK'});
        this.isSaving = false;
        this.previousState();
    }

    private onSaveError() {
        this.isSaving = false;
    }

    private onError(error: any) {
        this.jhiAlertService.error(error.message, null, null);
    }

    trackSituacaoById(index: number, item: Situacao) {
        return item.id;
    }

    trackSistemaAguaById(index: number, item: SistemaAgua) {
        return item.id;
    }

    trackComunaById(index: number, item: Comuna) {
        return item.id;
    }

    // VERDE = Recebe o resultado do último mês(Mês Anterior):
    // V1, V2, V22 AO V25,V32,V33, V56 AO V62, V73, V74, V77 AO 79
    findLastIndicador() {
        this.indicadorProducaoService.findLast().subscribe(
            (res: HttpResponse<IndicadorProducao>) => {
                const indicadorMesAnterior = res.body;
                if (indicadorMesAnterior) {
                    this.indicadorProducao.qtdCaptacoes = indicadorMesAnterior.qtdCaptacoes;  // 56
                    this.indicadorProducao.qtdEtas = indicadorMesAnterior.qtdEtas; // 57
                    this.indicadorProducao.qtdReservatorios = indicadorMesAnterior.qtdReservatorios; // 58
                    this.indicadorProducao.qtdEstacoesElevatorias = indicadorMesAnterior.qtdEstacoesElevatorias; // 59
                    this.indicadorProducao.qtdComprimentoAdutoras = indicadorMesAnterior.qtdComprimentoAdutoras; // 60
                    this.indicadorProducao.qtdComprimentoRedes = indicadorMesAnterior.qtdComprimentoRedes; // 61
                    this.indicadorProducao.qtdComprimentoRamais = indicadorMesAnterior.qtdComprimentoRamais; // 62
                    this.indicadorProducao.qtdManuaisMoPrevistos = indicadorMesAnterior.qtdManuaisMoPrevistos; // 73
                    this.indicadorProducao.qtdManuaisMmsPrevistos = indicadorMesAnterior.qtdManuaisMmsPrevistos; // 74
                    this.indicadorProducao.qtdAcoesManuaisMoRealizadas = indicadorMesAnterior.qtdAcoesManuaisMoRealizadas; // 77
                    this.indicadorProducao.qtdManuaisMmsRealizadas = indicadorMesAnterior.qtdManuaisMmsRealizadas; // 78
                    this.indicadorProducao.qtdManuaisCmpRealizadas = indicadorMesAnterior.qtdManuaisCmpRealizadas; // 79
                }
                this.somaCampos();
            },
            (error1) => {
                (this.onError(error1));
            });
    }

    // AZUL = Recebe a soma dos campos(Não precisa digitar):
    // V55, V67, V72, V76, V80
    somaCampos() {
        this.indicadorProducao.vlrCustoTotaisCapexOpex = this.indicadorProducao.vlrCustoOperacionaisOpex + this.indicadorProducao.vlrCustoAmortizaAnualInvestOpCapex; // 55
       // this.indicadorProducao.// 67
        this.indicadorProducao.qtdAcoesFormacaoRealizadas = this.indicadorProducao.qtdAcoesFormacaoMoRealizadas
            + this.indicadorProducao.qtdAcoesFormacaoMmsRealizadas + this.indicadorProducao.qtdAcoesFormacaoCmpRealizadas
            + this.indicadorProducao.qtdAcoesFormacaoSoftwareFornecidosRealizadas; // 72
        this.indicadorProducao.qtdManuaisPrevistos = this.indicadorProducao.qtdManuaisMoPrevistos
            + this.indicadorProducao.qtdManuaisMmsPrevistos + this.indicadorProducao.qtdManuaisCmpPrevistos; // 76
        this.indicadorProducao.qtdManuaisRealizados = this.indicadorProducao.qtdAcoesManuaisMoRealizadas
            + this.indicadorProducao.qtdManuaisMmsRealizadas + this.indicadorProducao.qtdManuaisCmpRealizadas; // 80
    }

    previousState() {
        window.history.back();
    }
}

@Component({
    selector: 'jhi-indicador-producao-popup',
    template: ''
})
export class IndicadorProducaoPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private indicadorProducaoPopupService: IndicadorProducaoPopupService
    ) {
    }

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if (params['id']) {
                this.indicadorProducaoPopupService
                    .open(IndicadorProducaoDialogComponent as Component, params['id']);
            } else {
                this.indicadorProducaoPopupService
                    .open(IndicadorProducaoDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
