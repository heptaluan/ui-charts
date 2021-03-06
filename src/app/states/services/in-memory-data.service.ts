import { InMemoryDbService } from 'angular-in-memory-web-api'
import { ProjectList } from '../models/project.model'
import { ProjectTemplateList } from '../models/template.model'
import { Case } from '../models/case.model'

export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    const projects = {
      resultCode: 1000,
      message: '',
      data: {
        projects: [
          {
            id: '10',
            name: 'Celeritas',
            thumb: 'http://placehold.it/92x92',
            description: '',
            public: false,
            type: 'singlechart',
            public_url: 'langnal.com',
            private_url: 'langnal.com',
            enable_private_link: true,
          },
          {
            id: '11',
            name: 'Mr. Nice',
            thumb: 'http://placehold.it/92x92',
            description: '',
            public: true,
            type: 'singlechart',
            public_url: 'langnal.com',
            private_url: 'langnal.com',
            enable_private_link: true,
          },
          {
            id: '12',
            name: 'Narco',
            thumb: 'http://placehold.it/92x92',
            description: '',
            public: true,
            type: 'singlechart',
            public_url: 'langnal.com',
            private_url: 'langnal.com',
            enable_private_link: true,
          },
          {
            id: '13',
            name: 'Bombasto',
            thumb: 'http://placehold.it/92x92',
            description: '',
            public: true,
            type: 'charts',
            public_url: 'langnal.com',
            private_url: 'langnal.com',
            enable_private_link: true,
          },
          {
            id: '14',
            name: 'Celeritas',
            thumb: 'http://placehold.it/92x92',
            description: '',
            public: false,
            type: 'charts',
            public_url: 'langnal.com',
            private_url: 'langnal.com',
            enable_private_link: true,
          },
          {
            id: '15',
            name: 'Mr. Nice',
            thumb: 'http://placehold.it/92x92',
            description: '',
            public: true,
            type: 'charts',
            public_url: 'langnal.com',
            private_url: 'langnal.com',
            enable_private_link: true,
          },
          {
            id: '16',
            name: 'Narco',
            thumb: 'http://placehold.it/92x92',
            description: '',
            public: true,
            type: 'singlechart',
            public_url: 'langnal.com',
            private_url: 'langnal.com',
            enable_private_link: true,
          },
          {
            id: '17',
            name: 'Bombasto',
            thumb: 'http://placehold.it/92x92',
            description: '',
            public: true,
            type: 'singlechart',
            public_url: 'langnal.com',
            private_url: 'langnal.com',
            enable_private_link: true,
          },
          {
            id: '18',
            name: 'Celeritas',
            thumb: 'http://placehold.it/92x92',
            description: '',
            public: true,
            type: 'singlechart',
            public_url: 'langnal.com',
            private_url: 'langnal.com',
            enable_private_link: true,
          },
          {
            id: '19',
            name: 'Celeritas',
            thumb: 'http://placehold.it/92x92',
            description: '',
            public: true,
            type: 'singlechart',
            public_url: 'langnal.com',
            private_url: 'langnal.com',
            enable_private_link: true,
          },
        ],
      },
    }
    const templates = {
      resultCode: 1000,
      message: '',
      data: {
        templates: [
          { id: '111', name: '??????1', thumb: 'http://placehold.it/98x122' },
          { id: '222', name: '??????2', thumb: 'http://placehold.it/98x122' },
          { id: '333', name: '??????3', thumb: 'http://placehold.it/98x122' },
        ],
      },
    }
    const cases = {
      resultCode: 1000,
      message: '',
      data: {
        cases: [
          {
            id: 1,
            title: '????????????????????????????????????????????????',
            author: 'Mr Ming',
            watch: 22,
            like: 77,
            imgsrc: 'http://placehold.it/198x106',
          },
          {
            id: 1,
            title: '????????????????????????????????????????????????',
            author: 'Miss Liu',
            watch: 22,
            like: 77,
            imgsrc: 'http://placehold.it/198x106',
          },
          {
            id: 1,
            title: '????????????????????????????????????????????????',
            author: 'Mr Ming',
            watch: 22,
            like: 77,
            imgsrc: 'http://placehold.it/198x106',
          },
          {
            id: 1,
            title: '????????????????????????????????????????????????',
            author: 'Miss Liu',
            watch: 22,
            like: 77,
            imgsrc: 'http://placehold.it/198x106',
          },
          {
            id: 1,
            title: '????????????????????????????????????????????????',
            author: 'Mr Ming',
            watch: 22,
            like: 77,
            imgsrc: 'http://placehold.it/198x106',
          },
          {
            id: 1,
            title: '????????????????????????????????????????????????',
            author: 'Miss Liu',
            watch: 22,
            like: 77,
            imgsrc: 'http://placehold.it/198x106',
          },
          {
            id: 1,
            title: '????????????????????????????????????????????????',
            author: 'Mr Ming',
            watch: 22,
            like: 77,
            imgsrc: 'http://placehold.it/198x106',
          },
          {
            id: 1,
            title: '????????????????????????????????????????????????',
            author: 'Miss Liu',
            watch: 22,
            like: 77,
            imgsrc: 'http://placehold.it/198x106',
          },
          {
            id: 1,
            title: '????????????????????????????????????????????????',
            author: 'Mr Ming',
            watch: 22,
            like: 77,
            imgsrc: 'http://placehold.it/198x106',
          },
          {
            id: 1,
            title: '????????????????????????????????????????????????',
            author: 'Miss Liu',
            watch: 22,
            like: 77,
            imgsrc: 'http://placehold.it/198x106',
          },
          {
            id: 1,
            title: '????????????????????????????????????????????????',
            author: 'Mr Ming',
            watch: 22,
            like: 77,
            imgsrc: 'http://placehold.it/198x106',
          },
          {
            id: 1,
            title: '????????????????????????????????????????????????',
            author: 'Miss Liu',
            watch: 22,
            like: 77,
            imgsrc: 'http://placehold.it/198x106',
          },
          {
            id: 1,
            title: '????????????????????????????????????????????????',
            author: 'Mr Ming',
            watch: 22,
            like: 77,
            imgsrc: 'http://placehold.it/198x106',
          },
          {
            id: 1,
            title: '????????????????????????????????????????????????',
            author: 'Miss Liu',
            watch: 22,
            like: 77,
            imgsrc: 'http://placehold.it/198x106',
          },
        ],
      },
    }
    const casedetail = {
      resultCode: 1000,
      message: '',
      data: {
        title: '2018CES????????????????????????????????????????????????',
        date: '2018???03???01???',
        watch: 222,
        like: 333,
        imgsrc: 'http://placehold.it/700x622',
        description:
          '????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????beta????????????????????????????????????????????????????????????????????????????????????6763?????????2018???4?????????????????????',
        author: '????????????',
        profile: 'http://placehold.it/50x50',
        slogan: '??????????????????????????????????????????????????????????????????????????????????????????????????????',
      },
    }

    const chart1 = {
      resultCode: 1000,
      message: 'success',
      data: {
        id: '152490449771507822',
        pro: 1,
        project_id: '152490449771507822',
        user_id: '152472575454656921',
        title: '??????????????????demo',
        description:
          '???1????????????????????????????????????????????????\n???2????????????????????????????????????????????????\n?????????????????????????????????????????????????????????????????????????????????????????????????????????',
        tags: null,
        private: 1,
        type: 'chart',
        create_time: null,
        modify_time: '2018-04-28T16:34:58',
        theme_id: 0,
        theme: {
          title: 'basic',
          colors: ['#sdgagg', '#dfhdxg', '#dgsffd'],
          fontFamily: '',
          texts: {
            header1: {
              fontSize: 38,
            },
            header2: {
              fontSize: 26,
            },
            body: {
              fontSize: 22,
            },
          },
          charts: {
            animation: 1,
            fonts: {
              fontSize: 13,
              color: '',
            },
            title: 1,
            legend: 1,
            toolTips: 1,
          },
        },
        article: {
          contents: {
            blocks: [
              {
                design: {
                  backgroundColor: '@colors[15]',
                  foregroundColor: '@colors[11]',
                  height: null,
                  width: '500px',
                },
                id: '152490449771507822',
                type: 'chart',
                data: '????????????,??????????????????\n?????????????????????,699.91\n??????,529.99\n????????????,731.16\n????????????,1477.76\n????????????,1050.43',
                props: {
                  basic: {
                    title: {
                      text: '????????????',
                      left: 'center',
                      textStyle: {
                        color: 'black',
                        fontSize: 16,
                      },
                      show: true,
                      top: 'top',
                    },
                    legend: {
                      orient: 'horizontal',
                      show: true,
                      left: 'center',
                      textStyle: {
                        color: 'black',
                        fontSize: 10,
                      },
                      top: 'bottom',
                      data: ['?????????????????????', '??????', '????????????', '????????????', '????????????'],
                    },
                    size: {
                      height: '500px',
                      width: '100%',
                    },
                  },
                  column: {
                    aCol: 0,
                    vCol: 1,
                  },
                  colors: ['#29A2C6', '#FFCB18', '#73B66B', '#FF6D31', '#A7DBDB'],
                },
              },
            ],
          },
          hash: 'xsdfhsdgfjdfgghvhu457rth',
        },
      },
      redirectUrl: null,
    }

    const chartProject = {
      resultCode: 1000,
      message: '',
      data: {
        id: '994482387056533504',
        pro: true,
        user_id: '457456846796',
        title: 'test',
        description: '',
        tags: '',
        private: true,
        public_url: 'http://baidu.com',
        private_url: 'http://baidu.com',
        password: '123456',
        enable_private_link: true,
        create_time: '2018/1/1',
        modify_time: '2018/2/1',
        version: 1,
        type: 'chart',
        article: {
          contents: {
            blocks: [
              {
                projectId: '994482387056533504',
                blockId: '457345734573457',
                type: 'chart',
                dataSrc: {
                  srcType: 'local',
                  dataType: 'dimension',
                  data: '????????????,??????????????????\n?????????????????????,699.91\n??????,529.99\n????????????,731.16\n????????????,1477.76\n????????????,1050.43',
                  download: true,
                },
                template: 'pie-chart',
                templateId: '444746070325460997',
                templateSwitch: 1,
                theme: {
                  themeId: '13',
                  name: 'basic',
                  colors: [
                    '#111',
                    '#222',
                    '#333',
                    '#444',
                    '#555',
                    '#666',
                    '#777',
                    '#888',
                    '#999',
                    '#aaa',
                    '#bbb',
                    '#ccc',
                    '#ddd',
                    '#eee',
                    '#fff',
                  ],
                  fonts: {
                    fontSize: 12,
                    color: 2,
                    fontFamilay: 'Noto Sans SC',
                  },
                },
                props: {
                  size: {
                    height: '800',
                    width: '400',
                    ratio: 0.5,
                    rotate: 0,
                  },
                  map: [
                    {
                      name: '?????????',
                      index: 0,
                      allowType: 'string',
                    },
                    {
                      name: '???',
                      index: 1,
                      allowType: 'number',
                    },
                  ],
                  legend: {
                    show: true,
                    xPosition: 'center',
                    yPosition: 'bottom',
                  },
                  axis: null,
                  font: {
                    fontSize: null,
                    color: null,
                    fontFamilay: null,
                  },
                  tooltips: true,
                  colors: {
                    type: 'multiple',
                    list: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
                  },
                },
              },
            ],
          },
          hash: 'asdgasr547egdfbasfha246',
        },
      },
    }

    const infographicInfo = {
      resultCode: 1000,
      message: 'successed',
      data: {
        id: '152652821884095907',
        pro: true,
        project_id: '152652821884095907',
        user_id: '152472575454656921',
        title: 'test',
        description: '',
        tags: '',
        private: true,
        type: 'infographic',
        publish_url: 'sdgsadg',
        private_url: '',
        create_time: '',
        modify_time: '',
        theme_id: 24,
        version: 2,
        theme: null,

        article: {
          contents: {
            design: {
              backgroundColor: '#fff',
              height: '800',
              width: '500',
            },
            pages: [
              {
                pageId: '152652821884533979',
                design: null,
                blocks: [
                  {
                    blockId: '152653991950269342',
                    type: 'chart',
                    position: {
                      left: 50,
                      top: 80,
                    },
                    dataSrc: {
                      srcType: 'local',
                      dataType: 'object-table', // 'object-table',
                      data: '????????????,???????????????\n?????????????????????, 699.91\n??????, 529.99\n????????????, 731.16\n????????????, 1477.76\n????????????, 1050.43',
                      url: '',
                      download: true,
                    },
                    label: '<e-piebasic-chart>',
                    templateId: '444746070325460997',
                    templateSwitch: 'key-value', // ????????????
                    theme: null,
                    props: {
                      size: {
                        height: '300',
                        width: '300', // ??????????????????????????????,
                        ratio: 1,
                      },
                      map: [
                        [
                          {
                            name: 'X???',
                            index: 0,
                            allowType: 'string',
                            isLegend: true,
                          },
                          {
                            name: 'Y???',
                            index: 1,
                            allowType: 'number',
                            isLegend: false,
                          },
                        ],
                      ],
                      legend: {
                        show: true,
                        xPosition: 'center',
                        yPosition: 'bottom',
                      },
                      axis: {
                        grid: {
                          show: 'all',
                          color: '',
                        },
                        color: '#000',
                        x: {
                          labelShow: true,
                          name: '',
                        },
                        y: {
                          labelShow: true,
                          name: '',
                          range: [],
                        },
                      },
                      font: {
                        fontSize: 13,
                        color: '#fff',
                        fontFamily: '',
                      },
                      tooltip: true,
                      colors: {
                        type: 'multiple',
                        list: ['#25ad4c4', '#233232'],
                      },
                    },
                  },
                  {
                    blockId: 'sdg8659erbgvggsd4yv',
                    type: 'text',
                    position: {
                      left: 60,
                      top: 80,
                    },
                    props: {
                      size: {
                        height: '300',
                        width: '400',
                      },
                      opacity: 100,
                      fontSize: 40,
                      fontFamily: '',
                      color: '#ddd',
                      basic: {
                        bold: true,
                        underline: false,
                        italic: false,
                        deleteline: false,
                        align: 'left',
                      },
                      template: 'body',
                      content: 'hello world',
                    },
                  },
                ],
              },
            ],
          },
          hash: 'xsdfhsdgfjdfgghvhu457rth',
        },
      },
    }

    return {
      projects: projects,
      templates: templates,
      cases: cases,
      casedetail: casedetail,
      chartProject: chartProject,
      infographicInfo: infographicInfo,
    }
  }
}
