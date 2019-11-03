import {Component, OnInit, OnDestroy, ViewChild, ElementRef} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { ProgramasProjectos } from './programas-projectos.model';
import { ProgramasProjectosPopupService } from './programas-projectos-popup.service';
import { ProgramasProjectosService } from './programas-projectos.service';
import { Comuna, ComunaService } from '../comuna';
import {Subscription} from 'rxjs';
import {Concepcao, ConcepcaoService} from '../concepcao';
import {SistemaAgua, SistemaAguaService} from '../sistema-agua';
import {Concurso, ConcursoService} from '../concurso';
import {Adjudicacao, AdjudicacaoService} from '../adjudicacao';
import {Contrato, ContratoService} from '../contrato';

@Component({
    selector: 'jhi-programas-projectos-dialog',
    templateUrl: './programas-projectos-dialog.component.html'
})

export class ProgramasProjectosDialogComponent implements OnInit {

    programasProjectos: ProgramasProjectos = new ProgramasProjectos();
    isSaving: boolean;

    comunas: Comuna[];
    dttLancamentoDp: any;
    dtUltimaAlteracaoDp: any;
    controleSessoes: string;
    private subscription: Subscription;

    // Concepcao
    concepcao: Concepcao;
    programasprojectos: ProgramasProjectos[];
    sistemaaguas: SistemaAgua[];
    @ViewChild('closeModal') private closeModal: ElementRef;

    // Concurso
    concurso: Concurso;
    @ViewChild('closeModalConcurso') private closeModalConcurso: ElementRef;

    // Adjacao
    adjudicacao: Adjudicacao;
    @ViewChild('closeModalAdj') private closeModalAdj: ElementRef;

    // CONTRATO
    contrato: Contrato;
    @ViewChild('closeModalContrato') private closeModalContrato: ElementRef;

    constructor(
        private jhiAlertService: JhiAlertService,
        private programasProjectosService: ProgramasProjectosService,
        private comunaService: ComunaService,
        private eventManager: JhiEventManager,
        private route: ActivatedRoute,
        private concepcaoService: ConcepcaoService,
        private concursoService: ConcursoService,
        private adjService: AdjudicacaoService,
        private contratoService: ContratoService,
        private sistemaAguaService: SistemaAguaService,
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
        this.subscription = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.load(params['id']);
            } else {
                this.programasProjectos = new ProgramasProjectos();
            }
        });

        this.concepcao = new Concepcao();
        this.concurso = new Concurso();
        this.adjudicacao = new Adjudicacao();
        this.contrato = new Contrato();
        this.loadAllSisstemasAgua();
        this.comunaService.query()
            .subscribe((res: HttpResponse<Comuna[]>) => { this.comunas = res.body; }, (res: HttpErrorResponse) => this.onError(res.message));
    }

    loadAllSisstemasAgua() {
        this.sistemaAguaService.query().subscribe(
            (res: HttpResponse<SistemaAgua[]>) => this.sistemaaguas = res.body,
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }

    load(id) {
        this.programasProjectosService.find(id)
            .subscribe((programasProjectosResponse: HttpResponse<ProgramasProjectos>) => {
                const programasProjectos: ProgramasProjectos = programasProjectosResponse.body;
                if (programasProjectos.dtLancamento) {
                    programasProjectos.dtLancamento = {
                        year: programasProjectos.dtLancamento.getFullYear(),
                        month: programasProjectos.dtLancamento.getMonth() + 1,
                        day: programasProjectos.dtLancamento.getDate()
                    };
                }
                if (programasProjectos.dtUltimaAlteracao) {
                    programasProjectos.dtUltimaAlteracao = {
                        year: programasProjectos.dtUltimaAlteracao.getFullYear(),
                        month: programasProjectos.dtUltimaAlteracao.getMonth() + 1,
                        day: programasProjectos.dtUltimaAlteracao.getDate()
                    };
                }
                this.programasProjectos = programasProjectos;
                this.loadConcepcao(this.programasProjectos.id);
                this.loadConcurso(this.programasProjectos.id);
                this.loadAdjudiacao(this.programasProjectos.id);
                this.loadContrato(this.programasProjectos.id);
            });
    }

    loadConcepcao(id) {
        this.concepcaoService.findByProgramasProjectos(id)
            .subscribe((concepcaoResponse: HttpResponse<Concepcao>) => {
                const concepcao: Concepcao = concepcaoResponse.body;
                if (concepcao.dtLancamento) {
                    concepcao.dtLancamento = {
                        year: concepcao.dtLancamento.getFullYear(),
                        month: concepcao.dtLancamento.getMonth() + 1,
                        day: concepcao.dtLancamento.getDate()
                    };
                }
                if (concepcao.dtUltimaAlteracao) {
                    concepcao.dtUltimaAlteracao = {
                        year: concepcao.dtUltimaAlteracao.getFullYear(),
                        month: concepcao.dtUltimaAlteracao.getMonth() + 1,
                        day: concepcao.dtUltimaAlteracao.getDate()
                    };
                }
                if (concepcao.dtAprovacaoCon) {
                    concepcao.dtAprovacaoCon = {
                        year: concepcao.dtAprovacaoCon.getFullYear(),
                        month: concepcao.dtAprovacaoCon.getMonth() + 1,
                        day: concepcao.dtAprovacaoCon.getDate()
                    };
                }
                if (concepcao.dtElaboracaoCon) {
                    concepcao.dtElaboracaoCon = {
                        year: concepcao.dtElaboracaoCon.getFullYear(),
                        month: concepcao.dtElaboracaoCon.getMonth() + 1,
                        day: concepcao.dtElaboracaoCon.getDate()
                    };
                }
                this.concepcao = concepcao;
            });
    }

    loadConcurso(id) {
        this.concursoService.findByProgramasProjectos(id)
            .subscribe((concursoResponse: HttpResponse<Concurso>) => {
                const concurso: Concurso = concursoResponse.body;
                if (concurso.dtLancamento) {
                    concurso.dtLancamento = {
                        year: concurso.dtLancamento.getFullYear(),
                        month: concurso.dtLancamento.getMonth() + 1,
                        day: concurso.dtLancamento.getDate()
                    };
                }
                if (concurso.dtUltimaAlteracao) {
                    concurso.dtUltimaAlteracao = {
                        year: concurso.dtUltimaAlteracao.getFullYear(),
                        month: concurso.dtUltimaAlteracao.getMonth() + 1,
                        day: concurso.dtUltimaAlteracao.getDate()
                    };
                }
                if (concurso.dtAberturaProposta) {
                    concurso.dtAberturaProposta = {
                        year: concurso.dtAberturaProposta.getFullYear(),
                        month: concurso.dtAberturaProposta.getMonth() + 1,
                        day: concurso.dtAberturaProposta.getDate()
                    };
                }
                if (concurso.dtAprovRelAvalFinal) {
                    concurso.dtAprovRelAvalFinal = {
                        year: concurso.dtAprovRelAvalFinal.getFullYear(),
                        month: concurso.dtAprovRelAvalFinal.getMonth() + 1,
                        day: concurso.dtAprovRelAvalFinal.getDate()
                    };
                }
                if (concurso.dtConclusaoAvaliacaoRelPrel) {
                    concurso.dtConclusaoAvaliacaoRelPrel = {
                        year: concurso.dtConclusaoAvaliacaoRelPrel.getFullYear(),
                        month: concurso.dtConclusaoAvaliacaoRelPrel.getMonth() + 1,
                        day: concurso.dtConclusaoAvaliacaoRelPrel.getDate()
                    };
                }
                if (concurso.dtEntregaProposta) {
                    concurso.dtEntregaProposta = {
                        year: concurso.dtEntregaProposta.getFullYear(),
                        month: concurso.dtEntregaProposta.getMonth() + 1,
                        day: concurso.dtEntregaProposta.getDate()
                    };
                }
                if (concurso.dtNegociacao) {
                    concurso.dtNegociacao = {
                        year: concurso.dtNegociacao.getFullYear(),
                        month: concurso.dtNegociacao.getMonth() + 1,
                        day: concurso.dtNegociacao.getDate()
                    };
                }
                this.concurso = concurso;
            });
    }

    loadAdjudiacao(id) {
        this.adjService.findByProgramasProjectos(id)
            .subscribe((adjResponse: HttpResponse<Adjudicacao>) => {
                const adjudicacao: Adjudicacao = adjResponse.body;
                if (adjudicacao.dtLancamento) {
                    adjudicacao.dtLancamento = {
                        year: adjudicacao.dtLancamento.getFullYear(),
                        month: adjudicacao.dtLancamento.getMonth() + 1,
                        day: adjudicacao.dtLancamento.getDate()
                    };
                }
                if (adjudicacao.dtComunicaoAdjudicacao) {
                    adjudicacao.dtComunicaoAdjudicacao = {
                        year: adjudicacao.dtComunicaoAdjudicacao.getFullYear(),
                        month: adjudicacao.dtComunicaoAdjudicacao.getMonth() + 1,
                        day: adjudicacao.dtComunicaoAdjudicacao.getDate()
                    };
                }
                if (adjudicacao.dtPrestacaoGarantBoaExec) {
                    adjudicacao.dtPrestacaoGarantBoaExec = {
                        year: adjudicacao.dtPrestacaoGarantBoaExec.getFullYear(),
                        month: adjudicacao.dtPrestacaoGarantBoaExec.getMonth() + 1,
                        day: adjudicacao.dtPrestacaoGarantBoaExec.getDate()
                    };
                }
                if (adjudicacao.dtSubmissaoMinutContrato) {
                    adjudicacao.dtSubmissaoMinutContrato = {
                        year: adjudicacao.dtSubmissaoMinutContrato.getFullYear(),
                        month: adjudicacao.dtSubmissaoMinutContrato.getMonth() + 1,
                        day: adjudicacao.dtSubmissaoMinutContrato.getDate()
                    };
                }

                this.adjudicacao = adjudicacao;
            });
    }

    loadContrato(id) {
        this.contratoService.findByProgramasProjectos(id)
            .subscribe((contratoResponse: HttpResponse<Contrato>) => {
                const contrato: Contrato = contratoResponse.body;
                if (contrato.dtLancamento) {
                    contrato.dtLancamento = {
                        year: contrato.dtLancamento.getFullYear(),
                        month: contrato.dtLancamento.getMonth() + 1,
                        day: contrato.dtLancamento.getDate()
                    };
                }
                if (contrato.dtAdiantamento) {
                    contrato.dtAdiantamento = {
                        year: contrato.dtAdiantamento.getFullYear(),
                        month: contrato.dtAdiantamento.getMonth() + 1,
                        day: contrato.dtAdiantamento.getDate()
                    };
                }
                if (contrato.dtAssinatura) {
                    contrato.dtAssinatura = {
                        year: contrato.dtAssinatura.getFullYear(),
                        month: contrato.dtAssinatura.getMonth() + 1,
                        day: contrato.dtAssinatura.getDate()
                    };
                }
                if (contrato.dtFinalizacaoProcessoHomologAprov) {
                    contrato.dtFinalizacaoProcessoHomologAprov = {
                        year: contrato.dtFinalizacaoProcessoHomologAprov.getFullYear(),
                        month: contrato.dtFinalizacaoProcessoHomologAprov.getMonth() + 1,
                        day: contrato.dtFinalizacaoProcessoHomologAprov.getDate()
                    };
                }
                if (contrato.dtInicio) {
                    contrato.dtInicio = {
                        year: contrato.dtInicio.getFullYear(),
                        month: contrato.dtInicio.getMonth() + 1,
                        day: contrato.dtInicio.getDate()
                    };
                }
                if (contrato.dtRecepcaoComicionamento) {
                    contrato.dtRecepcaoComicionamento = {
                        year: contrato.dtRecepcaoComicionamento.getFullYear(),
                        month: contrato.dtRecepcaoComicionamento.getMonth() + 1,
                        day: contrato.dtRecepcaoComicionamento.getDate()
                    };
                }
                if (contrato.dtRecepcaoDefinitiva) {
                    contrato.dtRecepcaoDefinitiva = {
                        year: contrato.dtRecepcaoDefinitiva.getFullYear(),
                        month: contrato.dtRecepcaoDefinitiva.getMonth() + 1,
                        day: contrato.dtRecepcaoDefinitiva.getDate()
                    };
                }
                if (contrato.dtRecepcaoProvisoria) {
                    contrato.dtRecepcaoProvisoria = {
                        year: contrato.dtRecepcaoProvisoria.getFullYear(),
                        month: contrato.dtRecepcaoProvisoria.getMonth() + 1,
                        day: contrato.dtRecepcaoProvisoria.getDate()
                    };
                }

                this.contrato = contrato;
            });
    }

    clear() {
    }

    save() {
        this.isSaving = true;
        if (this.programasProjectos.id !== undefined) {
            this.subscribeToSaveResponse(
                this.programasProjectosService.update(this.programasProjectos));
        } else {
            this.subscribeToSaveResponse(
                this.programasProjectosService.create(this.programasProjectos));
        }
    }

    validaConcepcao() {
        if (this.programasProjectos.id === undefined || this.programasProjectos.id === null) {
            this.programasProjectosService.create(this.programasProjectos).subscribe( (resp) => {
                this.programasProjectos = resp.body;
                console.log(resp);
                this.concepcao.programasProjectos = new ProgramasProjectos();
                this.concepcao.programasProjectos.id = this.programasProjectos.id;
                this.salvarConcepcao();
            });
        } else {
            this.concepcao.programasProjectos = new ProgramasProjectos();
            this.concepcao.programasProjectos.id = this.programasProjectos.id;
            this.salvarConcepcao();
        }
    }

    salvarConcepcao() {

        if (this.concepcao.id !== undefined && this.concepcao.id !== null) {
                this.concepcaoService.update(this.concepcao).subscribe( (event) => {
                    alert('Concepcao salva com sucesso!!');
                    console.log(event);
                    this.hideModalConcepcao();
                    this.concepcao = event.body;
                });
        } else {
            this.concepcaoService.create(this.concepcao).subscribe( (event) => {
                alert('Concepcao salva com sucesso!!');
                console.log(event);
                this.hideModalConcepcao();
                this.concepcao = event.body;
            });
        }
    }

    public hideModalConcepcao() {
        this.closeModal.nativeElement.click();
    }

    // CONCURSO
    validaConcurso() {
        if (this.programasProjectos.id === undefined || this.programasProjectos.id === null) {
            this.programasProjectosService.create(this.programasProjectos).subscribe( (resp) => {
                this.programasProjectos = resp.body;
                console.log(resp);
                this.concurso.programasProjectos = new ProgramasProjectos();
                this.concurso.programasProjectos.id = this.programasProjectos.id;
                this.salvarConcurso();
            });
        } else {
            this.concurso.programasProjectos = new ProgramasProjectos();
            this.concurso.programasProjectos.id = this.programasProjectos.id;
            this.salvarConcurso();
        }
    }

    salvarConcurso() {
        if (this.concurso.id !== undefined && this.concurso.id !== null) {
            this.concursoService.update(this.concurso).subscribe( (event) => {
                alert('Concurso salvo com sucesso!!');
                console.log(event);
                this.hideModalConcurso();
                this.concurso = event.body;
            });
        } else {
            this.concursoService.create(this.concurso).subscribe( (event) => {
                alert('Concurso salvo com sucesso!!');
                console.log(event);
                this.hideModalConcurso();
                this.concurso = event.body;
            });
        }
    }

    public hideModalConcurso() {
        this.closeModalConcurso.nativeElement.click();
    }

    // ADJUDIACAO
    validaAdjudicacao() {
        if (this.programasProjectos.id === undefined || this.programasProjectos.id === null) {
            this.programasProjectosService.create(this.programasProjectos).subscribe( (resp) => {
                this.programasProjectos = resp.body;
                console.log(resp);
                this.adjudicacao.programasProjectos = new ProgramasProjectos();
                this.adjudicacao.programasProjectos.id = this.programasProjectos.id;
                this.salvarAdjudicacao();
            });
        } else {
            this.adjudicacao.programasProjectos = new ProgramasProjectos();
            this.adjudicacao.programasProjectos.id = this.programasProjectos.id;
            this.salvarAdjudicacao();
        }
    }

    salvarAdjudicacao() {
        if (this.adjudicacao.id !== undefined) {
            this.adjService.update(this.adjudicacao).subscribe( (event) => {
                alert('Adjudicacao salvo com sucesso!!');
                console.log(event);
                this.hideModalAdj();
                this.adjudicacao = event.body;
            });
        } else {
            this.adjService.create(this.adjudicacao).subscribe( (event) => {
                alert('Adjudicacao salvo com sucesso!!');
                console.log(event);
                this.hideModalAdj();
                this.adjudicacao = event.body;
            });
        }
    }

    public hideModalAdj() {
        this.closeModalAdj.nativeElement.click();
    }

    // CONTRATO
    validaContrato() {
        if (this.programasProjectos.id === undefined || this.programasProjectos.id === null) {
            this.programasProjectosService.create(this.programasProjectos).subscribe( (resp) => {
                this.programasProjectos = resp.body;
                console.log(resp);
                this.contrato.programasProjectos = new ProgramasProjectos();
                this.contrato.programasProjectos.id = this.programasProjectos.id;
                this.salvarContrato();
            });
        } else {
            this.contrato.programasProjectos = new ProgramasProjectos();
            this.contrato.programasProjectos.id = this.programasProjectos.id;
            this.salvarContrato();
        }
    }

    salvarContrato() {
        if (this.contrato.id !== undefined && this.contrato.id !== null) {
            this.contratoService.update(this.contrato).subscribe( (event) => {
                alert('Contrato salvo com sucesso!!');
                console.log(event);
                this.hideModalContrato();
                this.contrato = event.body;
            });
        } else {
            this.contratoService.create(this.contrato).subscribe( (event) => {
                alert('Contrato salvo com sucesso!!');
                console.log(event);
                this.hideModalContrato();
                this.contrato = event.body;
            });
        }
    }

    public hideModalContrato() {
        this.closeModalContrato.nativeElement.click();
    }

    habilitarTela(valor) {
        this.controleSessoes = valor;
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<ProgramasProjectos>>) {
        result.subscribe((res: HttpResponse<ProgramasProjectos>) =>
            this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess(result: ProgramasProjectos) {
        this.eventManager.broadcast({ name: 'programasProjectosListModification', content: 'OK'});
        this.isSaving = false;
    }

    private onSaveError() {
        this.isSaving = false;
    }

    private onError(error: any) {
        this.jhiAlertService.error(error.message, null, null);
    }

    trackComunaById(index: number, item: Comuna) {
        return item.id;
    }

    previousState() {
        window.history.back();
    }
}

@Component({
    selector: 'jhi-programas-projectos-popup',
    template: ''
})
export class ProgramasProjectosPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private programasProjectosPopupService: ProgramasProjectosPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.programasProjectosPopupService
                    .open(ProgramasProjectosDialogComponent as Component, params['id']);
            } else {
                this.programasProjectosPopupService
                    .open(ProgramasProjectosDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
