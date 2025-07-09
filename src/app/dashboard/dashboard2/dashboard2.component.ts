import { Component, OnInit } from '@angular/core';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexStroke,
  ApexMarkers,
  ApexYAxis,
  ApexGrid,
  ApexTitleSubtitle,
  ApexTooltip,
  ApexLegend,
  ApexFill,
  ApexResponsive,
  ApexNonAxisChartSeries,
  NgApexchartsModule,
} from 'ng-apexcharts';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { NgScrollbar } from 'ngx-scrollbar';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { BreadcrumbComponent } from '../../shared/components/breadcrumb/breadcrumb.component';
import { IncomeInfoBoxComponent } from '@shared/components/income-info-box/income-info-box.component';
import { MatCardModule } from '@angular/material/card';
import { RecentCommentsComponent } from '@shared/components/recent-comments/recent-comments.component';
import {
  ProgressTableComponent,
  SubjectProgress,
} from '@shared/components/progress-table/progress-table.component';
import { EarningSourceComponent } from '@shared/components/earning-source/earning-source.component';
import { TableCardComponent } from '@shared/components/table-card/table-card.component';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  series2: ApexNonAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  dataLabels: ApexDataLabels;
  markers: ApexMarkers;
  colors: string[];
  yaxis: ApexYAxis;
  grid: ApexGrid;
  legend: ApexLegend;
  tooltip: ApexTooltip;
  fill: ApexFill;
  title: ApexTitleSubtitle;
  responsive: ApexResponsive[];
  labels: string[];
};

@Component({
  selector: 'app-dashboard2',
  templateUrl: './dashboard2.component.html',
  styleUrls: ['./dashboard2.component.scss'],
  imports: [
    BreadcrumbComponent,
    MatButtonModule,
    MatMenuModule,
    MatCardModule,
    MatIconModule,
    NgApexchartsModule,
    NgScrollbar,
    MatProgressBarModule,
    IncomeInfoBoxComponent,
    RecentCommentsComponent,
    ProgressTableComponent,
    EarningSourceComponent,
    TableCardComponent,
  ],
})
export class Dashboard2Component implements OnInit {
  public lineChartOptions!: Partial<ChartOptions>;
  public pieChartOptions!: Partial<ChartOptions>;
  //  color: ["#3FA7DC", "#F6A025", "#9BC311"],
  constructor() {
    //constructor
  }
  ngOnInit() {
    this.chart1();
    this.chart2();
  }

  private chart1() {
    this.lineChartOptions = {
      series: [
        {
          name: 'Product 1',
          data: [70, 200, 80, 180, 170, 105, 210],
        },
        {
          name: 'Product 2',
          data: [80, 250, 30, 120, 260, 100, 180],
        },
        {
          name: 'Product 3',
          data: [85, 130, 85, 225, 80, 190, 120],
        },
      ],
      chart: {
        height: 370,
        type: 'line',
        foreColor: '#9aa0ac',
        dropShadow: {
          enabled: true,
          color: '#000',
          top: 18,
          left: 7,
          blur: 10,
          opacity: 0.2,
        },
        toolbar: {
          show: false,
        },
      },
      colors: ['#00E396', '#775DD0', '#FEB019'],
      stroke: {
        curve: 'smooth',
      },
      grid: {
        show: true,
        borderColor: '#9aa0ac',
        strokeDashArray: 1,
      },
      markers: {
        size: 3,
      },
      xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
        title: {
          text: 'Month',
        },
      },
      yaxis: {
        // opposite: true,
        title: {
          text: 'Sales',
        },
      },
      legend: {
        position: 'top',
        horizontalAlign: 'right',
        floating: true,
        offsetY: -25,
        offsetX: -5,
      },
      tooltip: {
        theme: 'dark',
        marker: {
          show: true,
        },
        x: {
          show: true,
        },
      },
    };
  }

  private chart2() {
    this.pieChartOptions = {
      series2: [44, 55, 13, 43, 22],
      chart: {
        type: 'donut',
        width: 225,
      },
      legend: {
        show: false,
      },
      dataLabels: {
        enabled: false,
      },
      labels: ['Science', 'Mathes', 'Economics', 'History', 'Music'],
      responsive: [
        {
          breakpoint: 480,
          options: {},
        },
      ],
    };
  }

  //recent comments

  comments = [
    {
      name: 'Dr. Airi Satou',
      message: 'Lorem ipsum dolor sit amet, id quo eruditi eloquentiam.',
      timestamp: '7 hours ago',
      imgSrc: 'assets/images/user/user6.jpg',
      colorClass: 'col-green',
    },
    {
      name: 'Dr. Sarah Smith',
      message: 'Lorem ipsum dolor sit amet, id quo eruditi eloquentiam.',
      timestamp: '1 hour ago',
      imgSrc: 'assets/images/user/user4.jpg',
      colorClass: 'color-primary col-indigo',
    },
    {
      name: 'Dr. Cara Stevens',
      message: 'Lorem ipsum dolor sit amet, id quo eruditi eloquentiam.',
      timestamp: 'Yesterday',
      imgSrc: 'assets/images/user/user3.jpg',
      colorClass: 'color-danger col-cyan',
    },
    {
      name: 'Dr. Ashton Cox',
      message: 'Lorem ipsum dolor sit amet, id quo eruditi eloquentiam.',
      timestamp: 'Yesterday',
      imgSrc: 'assets/images/user/user7.jpg',
      colorClass: 'color-info col-orange',
      noBorder: true,
    },
    {
      name: 'Dr. Mark Hay',
      message: 'Lorem ipsum dolor sit amet, id quo eruditi eloquentiam.',
      timestamp: '1 hour ago',
      imgSrc: 'assets/images/user/user9.jpg',
      colorClass: 'color-primary col-red',
    },
  ];

  // Progress table data

  subjects: SubjectProgress[] = [
    { subject: 'Project A', progress: 30, duration: '2 Months' },
    { subject: 'Project B', progress: 55, duration: '3 Months' },
    { subject: 'Project C', progress: 67, duration: '1 Month' },
    { subject: 'Project D', progress: 70, duration: '2 Months' },
    { subject: 'Project E', progress: 24, duration: '3 Months' },
    { subject: 'Project F', progress: 77, duration: '4 Months' },
    { subject: 'Project G', progress: 41, duration: '2 Months' },
  ];

  // earning source

  sources = [
    {
      label: 'envato.com',
      percentage: 17,
      class: 'bg-green',
      labelClass: 'bg-green text-white',
    },
    {
      label: 'google.com',
      percentage: 27,
      class: 'bg-red',
      labelClass: 'bg-red text-white',
    },
    {
      label: 'yahoo.com',
      percentage: 25,
      class: 'bg-indigo',
      labelClass: 'bg-indigo text-white',
    },
    {
      label: 'store',
      percentage: 18,
      class: 'bg-orange',
      labelClass: 'bg-orange text-white',
    },
    {
      label: 'Others',
      percentage: 13,
      class: 'bg-dark',
      labelClass: 'bg-dark text-white',
    },
  ];

  // recent order data

  orderData = [
    {
      id: 'ID7865',
      name: 'Jens Brincker',
      phone: '(123)123456',
      address: 'Customer Address',
      item: 'iPhone X',
      orderDate: '05/22/2021',
      quantity: 2,
      paymentMethod: 'Credit Card',
      status: 'Paid',
      invoice: 'download link',
      img: 'assets/images/user/user1.jpg',
      detailsButton: 'Details',
    },
    {
      id: 'ID9357',
      name: 'Mark Harry',
      phone: '(123)123456',
      address: 'Customer Address',
      item: 'Pixel 2',
      orderDate: '06/12/2021',
      quantity: 1,
      paymentMethod: 'COD',
      status: 'Unpaid',
      invoice: 'download link',
      img: 'assets/images/user/user2.jpg',
      detailsButton: 'Details',
    },
    {
      id: 'ID3987',
      name: 'Anthony Davie',
      phone: '(123)123456',
      address: 'Customer Address',
      item: 'OnePlus',
      orderDate: '02/02/2021',
      quantity: 5,
      paymentMethod: 'Debit Card',
      status: 'Pending',
      invoice: 'download link',
      img: 'assets/images/user/user3.jpg',
      detailsButton: 'Details',
    },
    {
      id: 'ID2483',
      name: 'David Perry',
      phone: '(123)123456',
      address: 'Customer Address',
      item: 'Moto Z2',
      orderDate: '01/10/2021',
      quantity: 2,
      paymentMethod: 'Credit Card',
      status: 'Paid',
      invoice: 'download link',
      img: 'assets/images/user/user4.jpg',
      detailsButton: 'Details',
    },
    {
      id: 'ID2986',
      name: 'John Doe',
      phone: '(123)123456',
      address: 'Customer Address',
      item: 'Samsung F62',
      orderDate: '05/20/2021',
      quantity: 3,
      paymentMethod: 'Net Banking',
      status: 'Unpaid',
      invoice: 'download link',
      img: 'assets/images/user/user5.jpg',
      detailsButton: 'Details',
    },
    {
      id: 'ID1267',
      name: 'Sarah Smith',
      phone: '(123)123456',
      address: 'Customer Address',
      item: 'iPhone 12',
      orderDate: '07/10/2021',
      quantity: 1,
      paymentMethod: 'COD',
      status: 'Paid',
      invoice: 'download link',
      img: 'assets/images/user/user6.jpg',
      detailsButton: 'Details',
    },
    {
      id: 'ID3398',
      name: 'Cara Stevens',
      phone: '(123)123456',
      address: 'Customer Address',
      item: 'Moto Gs5',
      orderDate: '04/11/2021',
      quantity: 2,
      paymentMethod: 'UPI Payment',
      status: 'Pending',
      invoice: 'download link',
      img: 'assets/images/user/user7.jpg',
      detailsButton: 'Details',
    },
    {
      id: 'ID9965',
      name: 'Ashton Cox',
      phone: '(123)123456',
      address: 'Customer Address',
      item: 'Pixel 2',
      orderDate: '05/14/2021',
      quantity: 4,
      paymentMethod: 'Credit Card',
      status: 'Paid',
      invoice: 'download link',
      img: 'assets/images/user/user8.jpg',
      detailsButton: 'Details',
    },
  ];

  orderColumnDefinitions = [
    { def: 'id', label: 'Order ID', type: 'text' },
    { def: 'name', label: 'Customer Name', type: 'text' },
    { def: 'item', label: 'Item', type: 'text' },
    { def: 'orderDate', label: 'Order Date', type: 'date' },
    { def: 'quantity', label: 'Quantity', type: 'number' },
    { def: 'paymentMethod', label: 'Payment', type: 'text' },
    { def: 'status', label: 'Status', type: 'text' },
    { def: 'invoice', label: 'Invoice', type: 'file' },
    { def: 'detailsButton', label: 'Details', type: 'button' },
  ];
}
