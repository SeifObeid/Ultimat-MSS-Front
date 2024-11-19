<template>
    <div class="animated fadeIn">
        <!-- <b-row>
            <b-col sm="6" lg="3">
                <b-card no-body class="bg-primary">
                    <b-card-body class="pb-0">
                        <b-dropdown class="float-right" variant="transparent p-0" right>
                            <template slot="button-content">
                                <i class="icon-settings"></i>
                            </template>
                            <b-dropdown-item>Action</b-dropdown-item>
                            <b-dropdown-item>Another action</b-dropdown-item>
                            <b-dropdown-item>Something else here...</b-dropdown-item>
                            <b-dropdown-item disabled>Disabled action</b-dropdown-item>
                        </b-dropdown>
                        <h4 class="mb-0">120</h4>
                        <p class="fs-12">Calculation Sheets </p>
                    </b-card-body>
                    <card-line1-chart-example chartId="card-chart-01" class="chart-wrapper px-3" style="height:70px;"
                                              :height="70"/>
                </b-card>
            </b-col>
            <b-col sm="6" lg="3">
                <b-card no-body class="bg-info">
                    <b-card-body class="pb-0">
                        <b-dropdown class="float-right" variant="transparent p-0" right no-caret>
                            <template slot="button-content">
                                <i class="icon-location-pin"></i>
                            </template>
                            <b-dropdown-item>Action</b-dropdown-item>
                            <b-dropdown-item>Another action</b-dropdown-item>
                            <b-dropdown-item>Something else here...</b-dropdown-item>
                            <b-dropdown-item disabled>Disabled action</b-dropdown-item>
                        </b-dropdown>
                        <h4 class="mb-0">20</h4>
                        <p class="fs-12">Calculation sheet waiting approval</p>
                    </b-card-body>
                    <card-line2-chart-example chartId="card-chart-02" class="chart-wrapper px-3" style="height:70px;"
                                              :height="70"/>
                </b-card>
            </b-col>
            <b-col sm="6" lg="3">
                <b-card no-body class="bg-warning">
                    <b-card-body class="pb-0">
                        <b-dropdown class="float-right" variant="transparent p-0" right>
                            <template slot="button-content">
                                <i class="icon-settings"></i>
                            </template>
                            <b-dropdown-item>Action</b-dropdown-item>
                            <b-dropdown-item>Another action</b-dropdown-item>
                            <b-dropdown-item>Something else here...</b-dropdown-item>
                            <b-dropdown-item disabled>Disabled action</b-dropdown-item>
                        </b-dropdown>
                        <h4 class="mb-0">20</h4>
                        <p class="fs-12">Price Quotation waiting approval</p>
                    </b-card-body>
                    <card-line3-chart-example chartId="card-chart-03" class="chart-wrapper" style="height:70px;"
                                              height="70"/>
                </b-card>
            </b-col>
            <b-col sm="6" lg="3">
                <b-card no-body class="bg-danger">
                    <b-card-body class="pb-0">
                        <b-dropdown class="float-right" variant="transparent p-0" right>
                            <template slot="button-content">
                                <i class="icon-settings"></i>
                            </template>
                            <b-dropdown-item>Action</b-dropdown-item>
                            <b-dropdown-item>Another action</b-dropdown-item>
                            <b-dropdown-item>Something else here...</b-dropdown-item>
                            <b-dropdown-item disabled>Disabled action</b-dropdown-item>
                        </b-dropdown>
                        <h4 class="mb-0">9.823</h4>
                        <p class="fs-12">| </p>
                    </b-card-body>
                    <card-bar-chart-example chartId="card-chart-04" class="chart-wrapper px-3" style="height:70px;"
                                            height="70"/>
                </b-card>
            </b-col>
        </b-row> -->

        <b-row>
            <b-col>
                <calendar></calendar>
            </b-col>
        </b-row>
    </div>
</template>

<script>
    import Vue from 'vue';
    import CardLine1ChartExample from './dashboard/CardLine1ChartExample'
    import CardLine2ChartExample from './dashboard/CardLine2ChartExample'
    import CardLine3ChartExample from './dashboard/CardLine3ChartExample'
    import CardBarChartExample from './dashboard/CardBarChartExample'
    import MainChartExample from './dashboard/MainChartExample'
    import SocialBoxChartExample from './dashboard/SocialBoxChartExample'
    import CalloutChartExample from './dashboard/CalloutChartExample'
    import Calendar from '../components/events/CalendarView'
    import {Callout} from '@coreui/vue'

    export default {
        name: 'dashboard',
        components: {
            Callout,
            CardLine1ChartExample,
            CardLine2ChartExample,
            CardLine3ChartExample,
            CardBarChartExample,
            MainChartExample,
            SocialBoxChartExample,
            CalloutChartExample,
            Calendar,

        },
        data: function () {
            return {
                    piedata:{
                        "chart": {
                            "caption": "Recommended Portfolio Split",
                            "subCaption": "For a net-worth of $1M",
                            "showValues": "1",
                            "showPercentInTooltip": "0",
                            "numberPrefix": "$",
                            "enableMultiSlicing": "1",
                            "theme": "fusion"
                        },
                        "data": [
                            {
                                "label": "Equity",
                                "value": "300000"
                            },
                            {
                                "label": "Debt",
                                "value": "230000"
                            },
                            {
                                "label": "Bullion",
                                "value": "180000"
                            },
                            {
                                "label": "Real-estate",
                                "value": "270000"
                            },
                            {
                                "label": "Insurance",
                                "value": "20000"
                            }
                        ]
                    },
                // data: {
                    width: '700',
                    height: '400',
                    type: 'column2d',
                    dataFormat: 'json',
                    dataSource: {
                        "chart": {
                            "caption": "Top 3 Juice Flavors",
                            "subcaption": "Last year",
                            "xaxisname": "Flavor",
                            "yaxisname": "Amount (In USD)",
                            "numberprefix": "$",
                            "theme": "fusion",
                            "rotateValues": "0"
                        },
                        "data": [{
                            "label": "Apple",
                            "value": "810000",
                            "link": "newchart-xml-apple"
                        }, {
                            "label": "Cranberry",
                            "value": "620000",
                            "link": "newchart-xml-cranberry"
                        }, {
                            "label": "Grapes",
                            "value": "350000",
                            "link": "newchart-xml-grapes"
                        }],
                        "linkeddata": [{
                            "id": "apple",
                            "linkedchart": {
                                "chart": {
                                    "caption": "Apple Juice - Quarterly Sales",
                                    "subcaption": "Last year",
                                    "numberprefix": "$",
                                    "theme": "fusion",
                                    "rotateValues": "0",
                                    "plottooltext": "$label, $dataValue,  $percentValue"
                                },
                                "data": [{
                                    "label": "Q1",
                                    "value": "157000"
                                }, {
                                    "label": "Q2",
                                    "value": "172000"
                                }, {
                                    "label": "Q3",
                                    "value": "206000"
                                }, {
                                    "label": "Q4",
                                    "value": "275000"
                                }]
                            }
                        }, {
                            "id": "cranberry",
                            "linkedchart": {
                                "chart": {
                                    "caption": "Cranberry Juice - Quarterly Sales",
                                    "subcaption": "Last year",
                                    "numberprefix": "$",
                                    "theme": "fusion",
                                    "plottooltext": "$label, $dataValue,  $percentValue"
                                },
                                "data": [{
                                    "label": "Q1",
                                    "value": "102000"
                                }, {
                                    "label": "Q2",
                                    "value": "142000"
                                }, {
                                    "label": "Q3",
                                    "value": "187000"
                                }, {
                                    "label": "Q4",
                                    "value": "189000"
                                }]
                            }
                        }, {
                            "id": "grapes",
                            "linkedchart": {
                                "chart": {
                                    "caption": "Grapes Juice - Quarterly Sales",
                                    "subcaption": "Last year",
                                    "numberprefix": "$",
                                    "theme": "fusion",
                                    "rotateValues": "0",
                                    "plottooltext": "$label, $dataValue,  $percentValue"
                                },
                                "data": [{
                                    "label": "Q1",
                                    "value": "45000"
                                }, {
                                    "label": "Q2",
                                    "value": "72000"
                                }, {
                                    "label": "Q3",
                                    "value": "95000"
                                }, {
                                    "label": "Q4",
                                    "value": "108000"
                                }]
                            }
                        }]
                    },
                // },

                selected: 'Month',
                tableItems: [
                    {
                        avatar: {url: 'img/avatars/1.jpg', status: 'success'},
                        user: {name: 'Yiorgos Avraamu', new: true, registered: 'Jan 1, 2015'},
                        country: {name: 'USA', flag: 'us'},
                        usage: {value: 50, period: 'Jun 11, 2015 - Jul 10, 2015'},
                        payment: {name: 'Mastercard', icon: 'fa fa-cc-mastercard'},
                        activity: '10 sec ago'
                    },
                    {
                        avatar: {url: 'img/avatars/2.jpg', status: 'danger'},
                        user: {name: 'Avram Tarasios', new: false, registered: 'Jan 1, 2015'},
                        country: {name: 'Brazil', flag: 'br'},
                        usage: {value: 22, period: 'Jun 11, 2015 - Jul 10, 2015'},
                        payment: {name: 'Visa', icon: 'fa fa-cc-visa'},
                        activity: '5 minutes ago'
                    },
                    {
                        avatar: {url: 'img/avatars/3.jpg', status: 'warning'},
                        user: {name: 'Quintin Ed', new: true, registered: 'Jan 1, 2015'},
                        country: {name: 'India', flag: 'in'},
                        usage: {value: 74, period: 'Jun 11, 2015 - Jul 10, 2015'},
                        payment: {name: 'Stripe', icon: 'fa fa-cc-stripe'},
                        activity: '1 hour ago'
                    },
                    {
                        avatar: {url: 'img/avatars/4.jpg', status: ''},
                        user: {name: 'Enéas Kwadwo', new: true, registered: 'Jan 1, 2015'},
                        country: {name: 'France', flag: 'fr'},
                        usage: {value: 98, period: 'Jun 11, 2015 - Jul 10, 2015'},
                        payment: {name: 'PayPal', icon: 'fa fa-paypal'},
                        activity: 'Last month'
                    },
                    {
                        avatar: {url: 'img/avatars/5.jpg', status: 'success'},
                        user: {name: 'Agapetus Tadeáš', new: true, registered: 'Jan 1, 2015'},
                        country: {name: 'Spain', flag: 'es'},
                        usage: {value: 22, period: 'Jun 11, 2015 - Jul 10, 2015'},
                        payment: {name: 'Google Wallet', icon: 'fa fa-google-wallet'},
                        activity: 'Last week'
                    },
                    {
                        avatar: {url: 'img/avatars/6.jpg', status: 'danger'},
                        user: {name: 'Friderik Dávid', new: true, registered: 'Jan 1, 2015'},
                        country: {name: 'Poland', flag: 'pl'},
                        usage: {value: 43, period: 'Jun 11, 2015 - Jul 10, 2015'},
                        payment: {name: 'Amex', icon: 'fa fa-cc-amex'},
                        activity: 'Last week'
                    }
                ],
                tableFields: {
                    avatar: {
                        label: '<i class="icon-people"></i>',
                        class: 'text-center'
                    },
                    user: {
                        label: 'User'
                    },
                    country: {
                        label: 'Country',
                        class: 'text-center'
                    },
                    usage: {
                        label: 'Usage'
                    },
                    payment: {
                        label: 'Payment method',
                        class: 'text-center'
                    },
                    activity: {
                        label: 'Activity'
                    }
                }
            }
        },
        methods: {




            variant(value) {
                let $variant
                if (value <= 25) {
                    $variant = 'info'
                } else if (value > 25 && value <= 50) {
                    $variant = 'success'
                } else if (value > 50 && value <= 75) {
                    $variant = 'warning'
                } else if (value > 75 && value <= 100) {
                    $variant = 'danger'
                }
                return $variant
            },
            flag(value) {
                return 'flag-icon flag-icon-' + value
            }
        }
    }
</script>

<style>
    /* IE fix */
    #card-chart-01, #card-chart-02 {
        width: 100% !important;
    }

    .fs-12 {
        font-size: 12px;
    }
</style>
