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

  oncreate(vnode) {
    if (super.oncreate) {
      super.oncreate(vnode);
    }

    this.runScripts(vnode.dom);
  }

  onupdate(vnode) {
    if (super.onupdate) {
      super.onupdate(vnode);
    }

    this.runScripts(vnode.dom);
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
    return m.route.param('id');
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

  runScripts(root) {
    if (!root) return;

    root.querySelectorAll('script:not([data-executed])').forEach((old) => {
      const script = document.createElement('script');

      Array.from(old.attributes).forEach((attr) => {
        script.setAttribute(attr.name, attr.value);
      });

      if (script.src) script.async = false;

      script.textContent = old.textContent;
      script.dataset.executed = 'true';

      old.replaceWith(script);
    });
  }
}