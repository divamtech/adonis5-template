export default class Paginate {
  static do(obj) {
    const page = obj.meta.current_page;
    let total_pages = obj.meta.total / obj.meta.per_page
    //@ts-ignore
    if (parseInt(total_pages) != total_pages) {
      //@ts-ignore
      total_pages = parseInt(total_pages) + 1
    }
    total_pages = obj.meta.total == obj.meta.per_page ? 1 : total_pages;
    const pre_page = page > 1 && page <= total_pages ? page - 1 : null;
    const next_page = page < total_pages ? page + 1 : null;
    return { ...obj.meta, total_pages, pre_page, next_page };
  }

  static html(data, { maxShowPages = 6, route = '?page=' } = {}) {
    if (maxShowPages < 6) {
      maxShowPages = 6;
    }

    if (data.total_pages > 1) {
      let pre_pageView = '';
      if (data.pre_page) {
        pre_pageView = `<li class="page-item"><a class="page-link" href="${route}${data.pre_page}">&laquo;</a></li>`;
      }

      let next_pageView = '';
      if (data.next_page) {
        next_pageView = `<li class="page-item"><a class="page-link" href="${route}${data.next_page}">&raquo;</a></li>`;
      }

      let pageView = '';
      // for special cases when pages are greater than maxShowPages, and UI being distorted.
      if (data.total_pages > maxShowPages) {
        let pagesIndex = [1];
        if (data.current_page == data.last_page) {
          pagesIndex = [1, 0, data.current_page - 4, data.current_page - 3, data.current_page - 2, data.current_page - 1, data.current_page]
        } else if (data.current_page + 3 > data.last_page) {
          pagesIndex = [1, 0, data.last_page - 3, data.last_page - 2, data.last_page - 1, data.last_page]
        } else if (data.current_page < 4) {
          pagesIndex = [1, 2, 3, 4, 0, data.last_page]
        } else {
          pagesIndex = [1, 0, data.current_page - 1, data.current_page, data.current_page + 1, 0, data.last_page]
        }

        // Now just iterate and push elements, 0 denotes `...`
        pagesIndex.forEach((p) => {
          if (p == 0) {
            pageView += '<li class="page-item"><a class="page-link" href="#">...</a></li>';
            return;
          }
          let activeClass = '';
          if (data.current_page == p) {
            activeClass = 'active';
          }
          pageView += `<li class="page-item ${activeClass}"><a class="page-link" href="${route}${p}">${p}</a></li>`;
        });
      } else {
        // for normal cases when pages are less than maxShowPages
        for (let p = 1; p <= data.total_pages; p++) {
          let activeClass = '';
          if (data.current_page == p) {
            activeClass = 'active';
          }
          pageView += `<li class="page-item ${activeClass}"><a class="page-link" href="${route}${p}">${p}</a></li>`;
        }
      }

      return {
        data,
        show: true,
        html: `<div>
        <ul class="pagination">
          ${pre_pageView}
          ${pageView}
          ${next_pageView}
        </ul>
      </div>`,
      };
    }
    return { data, show: false, html: '' };
  }

  static doHTML(obj: any, option = undefined) {
    return this.html(this.do(obj), option);
  }
}
