import {ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MovieService} from "../shared/services/movie.service";
import {MaterialService} from "../shared/classes/material.service";
import {HomePageComponent} from "../home-page/home-page.component";

@Component({
  providers:[HomePageComponent],
  selector: 'app-movie-page',
  templateUrl: './movie-page.component.html',
  styleUrls: ['./movie-page.component.css']
})
export class MoviePageComponent implements OnInit {

  @ViewChild('input') inputRef: ElementRef;
  formImport: FormGroup;
  formInput: FormGroup;
  file: File;
  fileError: string;
  isDisable: boolean;
  isLoading: boolean;

  constructor(private movieService: MovieService,
              private cd: ChangeDetectorRef,
              private homeComp: HomePageComponent) { }

  ngOnInit() {
    this.formImport = new FormGroup({});
    this.isDisable = true;
    this.isLoading = false;
    this.formInput = new FormGroup({
      title: new FormControl(null, Validators.compose([
        Validators.required,
        Validators.pattern('[a-zA-Z ]*')]
      )),
      year: new FormControl(null, Validators.required),
      format: new FormControl(null, Validators.compose([
        Validators.required,
        Validators.pattern('[a-zA-Z ]*')]
      )),
      actors: new FormControl(null, Validators.compose([
        Validators.required,
        Validators.pattern('[a-zA-Z, ]*')]
      ))
    });
  }

  onSubmitSave() {
    this.movieSend(true, this.formInput.value, null);
  }


  onSubmitImport() {
    if (this.fileError.length > 0) {
      MaterialService.toast('Choose another file');
      return;
    }
    this.movieSend(false, null, this.file);
  }

  movieSend(save: boolean, formValue: object, file: File) {
    this.isLoading = true;
    this.cd.detectChanges();
    this.formImport.disable();
    this.formInput.disable();
    this.isDisable = true;
    let obs$;
    if (save === true)  obs$ = this.movieService.save(formValue);
    else                obs$ = this.movieService.import(file);
    obs$.subscribe(
      response => {
        MaterialService.toast(response.message);
        this.formImport.enable();
        this.formInput.enable();
        let element: HTMLElement = document.getElementById('search-submit') as HTMLElement;
        element.click();
        this.isLoading = false;
        delete this.file;
        this.cd.detectChanges();
      },
      error => {
        MaterialService.toast(error.error.message);
        this.formImport.enable();
        this.formInput.enable();
        this.isDisable = false;
      }
    )
  }

  triggerClick() {
    this.fileError = '';
    this.inputRef.nativeElement.click();
  }

  onFileUpload(event: any) {
    this.file= event.target.files[0];
    if (this.file.size === 0) {
      this.fileError = "File shouldn't be empty";
    } else if (this.file.type !== 'text/plain') {
      this.fileError = "Extension of the file should be .txt";
    }
    this.isDisable = this.fileError.length > 0;
    this.cd.detectChanges();
  }
}
