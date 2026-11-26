import { buildPaginationItems } from './portfolio-wizard.page';

describe('portfolio design list pagination', () => {
  it('returns empty list when totalPages is 0 or negative', () => {
    expect(buildPaginationItems(1, 0)).toEqual([]);
    expect(buildPaginationItems(1, -2)).toEqual([]);
  });

  it('shows all pages without ellipses when totalPages <= 7', () => {
    expect(buildPaginationItems(1, 1)).toEqual([{ kind: 'page', page: 1 }]);
    expect(buildPaginationItems(3, 5)).toEqual([
      { kind: 'page', page: 1 },
      { kind: 'page', page: 2 },
      { kind: 'page', page: 3 },
      { kind: 'page', page: 4 },
      { kind: 'page', page: 5 },
    ]);
    expect(buildPaginationItems(4, 7).every((item) => item.kind === 'page')).toBe(true);
  });

  it('renders leading window and trailing ellipsis on early pages', () => {
    const items = buildPaginationItems(1, 22);
    expect(items).toEqual([
      { kind: 'page', page: 1 },
      { kind: 'page', page: 2 },
      { kind: 'page', page: 3 },
      { kind: 'page', page: 4 },
      { kind: 'ellipsis', key: 'gap-4-22' },
      { kind: 'page', page: 22 },
    ]);
  });

  it('renders both ellipses when currentPage is in the middle of 22 pages', () => {
    const items = buildPaginationItems(10, 22);
    expect(items).toEqual([
      { kind: 'page', page: 1 },
      { kind: 'ellipsis', key: 'gap-1-9' },
      { kind: 'page', page: 9 },
      { kind: 'page', page: 10 },
      { kind: 'page', page: 11 },
      { kind: 'ellipsis', key: 'gap-11-22' },
      { kind: 'page', page: 22 },
    ]);
  });

  it('fills single-page gaps instead of emitting redundant ellipses', () => {
    const nearStart = buildPaginationItems(4, 22);
    expect(nearStart).toEqual([
      { kind: 'page', page: 1 },
      { kind: 'page', page: 2 },
      { kind: 'page', page: 3 },
      { kind: 'page', page: 4 },
      { kind: 'page', page: 5 },
      { kind: 'ellipsis', key: 'gap-5-22' },
      { kind: 'page', page: 22 },
    ]);

    const nearEnd = buildPaginationItems(19, 22);
    expect(nearEnd).toEqual([
      { kind: 'page', page: 1 },
      { kind: 'ellipsis', key: 'gap-1-18' },
      { kind: 'page', page: 18 },
      { kind: 'page', page: 19 },
      { kind: 'page', page: 20 },
      { kind: 'page', page: 21 },
      { kind: 'page', page: 22 },
    ]);
  });

  it('clamps out-of-range currentPage values safely', () => {
    expect(buildPaginationItems(99, 22)).toEqual(buildPaginationItems(22, 22));
    expect(buildPaginationItems(-5, 22)).toEqual(buildPaginationItems(1, 22));
  });
});
