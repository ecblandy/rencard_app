import { Affiliate } from '../../../types/affiliate-model';
import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from '../../../services/facade/admin.service';
import { Loader } from '../../../../../../shared/components/loader/loader';
import { NgIcon } from '@ng-icons/core';
import { SurfaceTitle } from '../../../../components/surface-title/surface-title';
import { Surface } from '../../../../../../shared/components/surface/surface';
import { UiLabel } from '../../../../../../shared/ui/label/label';
import { UiButton } from '../../../../../../shared/ui/button/button';

@Component({
  selector: 'app-partner-details',
  imports: [Loader, NgIcon, SurfaceTitle, Surface, UiLabel, UiButton],
  templateUrl: './partner-details.html',
  styleUrl: './partner-details.css',
})
export class PartnerDetails {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private adminServices = inject(AdminService);

  isLoadingUser = signal<boolean>(false);
  affiliate = signal<Partial<Affiliate>>({});

  constructor() {
    const id = this.route.snapshot.paramMap.get('id');

    this.loadAffiliate(Number(id));
  }

  private loadAffiliate(id: number) {
    this.isLoadingUser.set(true);
    this.adminServices.fetchAffiliateId(id).subscribe({
      next: (user) => {
        this.affiliate.set(user);
      },
      error: console.error,
      complete: () => this.isLoadingUser.set(false),
    });
  }

  goBack() {
    this.router.navigate(['/admin/partners']);
  }

  formatPrice(price: number) {
    return Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  }
}
