import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-expediente',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './expediente.html',
  styleUrls: ['./expediente.css']
})
export class Expediente implements OnInit {
  cita: any;
  cargando = true;

  constructor(private route: ActivatedRoute, private router: Router) {}

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;

    try {
      const res = await fetch(`https://backend-veterinaria-qedk.onrender.com/mascotas/${id}`);
      if (!res.ok) throw new Error('Error al cargar expediente');
      this.cita = await res.json();
    } catch (error) {
      console.error('❌ Error al cargar expediente:', error);
      alert('No se pudo cargar el expediente.');
    } finally {
      this.cargando = false;
    }
  }

  volver() {
    this.router.navigate(['/historial']);
  }
}
