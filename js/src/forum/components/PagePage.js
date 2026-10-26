import app from 'flarum/forum/app';
import Page from 'flarum/common/components/Page';
import PageStructure from 'flarum/forum/components/PageStructure';
import classList from 'flarum/common/utils/classList';

export default class PagePage extends Page {
  oninit(vnode) {
    super.oninit(vnode);

    this.page = null;

    this.loadPage();

    this.bodyClass = 'App--page';
  }

  view() {
    const page = this.page;

    return (
      <div className={classList('Pages', page?.isHtml() && 'Pages--isHtml')} data-id={page?.id()} data-slug={page?.slug()}>
        <PageStructure className="PagePage" hero={() => this.hero()} loading={!page}>
          {page && (
            <div className="Pages-container">
              <div className="Post-body">{this.content()}</div>
            </div>
          )}
        </PageStructure>
      </div>
    );
  }

  show(page) {
    this.page = page;

    app.history.push('page', page.title());
    app.setTitle(page.title());

    m.redraw();
  }

  hero() {
    return null;
  }

  content() {
    return m.trust(this.page.contentHtml());
  }

  id() {
    const id = m.route.param('id').split('-')[0];
    if (!isNaN(parseInt(id))) {
      return id;
    } else {
      return m.route.param('id');
    }
  }

  loadPage() {
    const id = this.id();

    const preloaded = app.preloadedApiDocument();
    const page = (!Array.isArray(preloaded) && preloaded) || app.store.getById('pages', id);

    if (page) {
      this.show(page);
    } else {
      Promise.all([
        app.store.find('pages', id).then((result) => {
          this.show(result);
        }),
        m.redraw(),
      ]);
    }
  }
}