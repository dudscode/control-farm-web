export interface ISearchOption {
  name: string;
  routerLink?: string;
}
export const optionsSearch: ISearchOption[] = [
    {
      name: 'Metas',
      routerLink: '/home/metas'
    },
    {
      name: 'Perfil',
      routerLink: '/home/perfil'
    },
    {
      name: 'Projetos',
      routerLink: '/home/producao'
    },
    {
      name: 'Configurações',
      routerLink: '/home/perfil'
    },
    {
      name: 'Objetivos',
      routerLink: '/home/metas'
    },
    {
      name: 'Vendas',
      routerLink: '/home/vendas'
    }
  ];