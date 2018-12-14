import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, NgForm, Validators} from "@angular/forms";
import {MovieService} from "../shared/services/movie.service";
import {Observable} from "rxjs";
import {Movie} from "../shared/interfaces";
import {MaterialInstance, MaterialService} from "../shared/classes/material.service";

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit, AfterViewInit , OnDestroy {

  form: FormGroup;
  movies$: Observable<Movie[]>;
  @ViewChild('modal') modalRef: ElementRef;
  modal: MaterialInstance;
  movie$: Observable<Movie>;
  movieDelete: boolean;
  movieId: string;
  target: any;
  isChecked: boolean;


  constructor(private movieService: MovieService,
              private cd: ChangeDetectorRef,) {
    this.form = new FormGroup({
      text: new FormControl(null, Validators.pattern('[a-zA-Z]*')),
      byMovie: new FormControl(true, Validators.requiredTrue),
      byActor: new FormControl(true, Validators.requiredTrue)
    })
  }

  ngOnInit() {
    this.isChecked = true;
    this.movies$ = this.movieService.fetch();
  }

  ngOnDestroy() {
    this.modal.destroy();
  }

  ngAfterViewInit() {
    this.modal = MaterialService.initModal(this.modalRef);
  }

  viewModal(id: string, event: any, goal: string) {
    this.movieDelete = false;
    if (goal === 'delete') {
      this.movieDelete = true;
      this.target = event.target;
      this.movieId =  id;
    }
    this.movie$ = this.movieService.getById(id);
    this.modal.open();
  }

  onSubmit() {
    if (!this.form.value.byMovie && !this.form.value.byActor) {
      this.isChecked = false;
      this.cd.detectChanges();
      return
    }

    if (this.form.value.text === null || this.form.value.text === '') {
      this.movies$ = this.movieService.fetch();
      return;
    }

    let criterion = 'none';
    if(this.form.value.byMovie && this.form.value.byActor) criterion = 'both';
    else if(this.form.value.byMovie && !this.form.value.byActor) criterion = 'byMovie';
    else if(!this.form.value.byMovie && this.form.value.byActor) criterion = 'byActor';
    this.movies$ = this.movieService.search(criterion, this.form.value.text);
  }

  deleteMovie() {
    this.movieService.delete(this.movieId).subscribe(
      response => MaterialService.toast(response.message),
      error => MaterialService.toast(error.error.message),
      () => this.target.closest('li').remove()
    );
  }

  onChange(event: boolean){
    if (event === true) this.isChecked = true;
  }
}
