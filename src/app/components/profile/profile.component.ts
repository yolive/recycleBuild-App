import { Component, OnInit } from '@angular/core';
import { ReciclagemService } from '../../services/reciclagem.service';
import { HeaderComponent } from "./header/header.component";
import {MatGridListModule} from '@angular/material/grid-list';
import { TopDoadoresComponent } from "./top-doadores/top-doadores.component";
import { PerfilComponent } from "./perfil/perfil.component";

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [HeaderComponent, MatGridListModule, TopDoadoresComponent, PerfilComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit {

  constructor() {}

  ngOnInit() {}

}
