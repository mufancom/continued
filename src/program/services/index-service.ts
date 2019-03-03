import {Express} from 'express';

import {MR_SERVICE_HOSTNAME, getFullHostnameFromBranch} from '../utils';

import {PortService} from './port-service';

const INDEX_PAGE_HOSTNAME = 'localhost' || MR_SERVICE_HOSTNAME;

export class IndexService {
  constructor(private app: Express, private portService: PortService) {
    this.initialize();
  }

  private initialize(): void {
    this.app.use('/', (request, response, next) => {
      let {hostname} = request;

      if (hostname !== INDEX_PAGE_HOSTNAME) {
        next();
        return;
      }

      let branches = this.portService.branches.sort();

      branches.push('fet/as', 'feature/ass');

      response.send(`
        <html>
          <head>
            <title>MR Temporary Servers - Makeflow</title>
            <style>
            body {
              font-family: Helvetica, Verdana, sans-serif;
            }

            div {
              width: 720px;
              margin: 30px;
            }

            h2 {
              font-size: 38px;
              font-weight: 400;
              margin: 0 0 0 5px;
              padding: 0;
            }

            h4 {
              margin-left: 10px;
              font-size: 18px;
              font-weight: 200;
              color: #ddd;
            }

            ul {
              list-style-type: none;
              margin: 15px 0;
              padding: 0;
            }

            li {
              font-size: 18px;
              font-weight: 200;
              border-bottom: 1px solid #f6f6f6;
            }

            li:last-child {
              border: none;
            }

            li a {
              text-decoration: none;
              color: #999;
              padding: 12px 10px;

              transition: background-color 0.3s ease, color 0.3s ease, padding-left 0.3s ease;
              display: block;
            }

            li a:hover {
              color: #000;
              background: #f6f6f6;
              padding-left: 30px;
              position: relative;
            }

            li a::before {
              content: '>';
              position: absolute;
              margin-left: -18px;
              color: rgb(41, 109, 255);
              opacity: 0;
              transition: opacity 0.5s ease;
            }

            li a:hover::before {
              opacity: 1;
            }

            li .tag {
              color: #fff;
              margin-right: 5px;
              font-size: 15px;
              padding: 3px 5px;
              border-radius: 3px;
              background-color: rgb(153, 153, 153);
            }

            li .tag.tag-feature {
              background-color: rgb(129, 203, 95);
            }

            li .tag.tag-fix {
              background-color: rgb(255, 187, 41);
            }
            </style>
          </head>
          <body>
            <div>
              <h2>Temporary Servers</h2>
              <ul>
                ${branches
                  .map(branch => {
                    let name: string | undefined;

                    let [type, ...names] = branch.split('/') as (
                      | string
                      | undefined)[];

                    if (!names.length) {
                      name = type!;
                      type = undefined;
                    } else {
                      name = names.join('/');
                    }

                    return `<li><a target="_blank" href="https://${getFullHostnameFromBranch(
                      branch,
                    )}">${
                      type ? `<span class="tag tag-${type}">${type}</span>` : ''
                    }${name}</a></li>`;
                  })
                  .join('')}
              </ul>
              ${branches.length === 0 ? '<h4>(empty)</h4>' : ''}
            </div>
          </body>
        </html>
      `);
    });
  }
}
