import React from "react";
import classNames from "classnames";
import Styles from "./pagination.styles.less";
import { SecondaryThemeButton, TinyThemeButton } from "./buttons";
import { SimpleChevron } from "./icons";

export interface PaginationProps {
  page: number;
  itemsPerPage: number;
  itemCount: number;
  action: Function;
  updateLimit?: Function;
  showLimitChanger?: boolean;
  maxLimit?: number;
  showPagination?: boolean;
  useFull?: boolean;
  maxButtons?: number;
}

export interface PagesArrayObject {
  page: number | null;
  active: boolean;
}

const NullPage = { page: null, active: false };

const getOffset = (page, pageLimit) => {
  return (page - 1) * pageLimit;
};

export const sliceByPage = (array, page, pageLimit) => {
  return array.slice(getOffset(page, pageLimit), getOffset(page, pageLimit) + pageLimit);
};

export const createPagesArray = (page: number, totalPages: number, maxButtons: number = 4) => {
  if (totalPages <= 1) {
    return [
      {
        page: 1,
        active: true,
      },
    ];
  }
  const PagesArray: Array<PagesArrayObject> = [];
  for (let i = 1; i <= totalPages; i++) {
    PagesArray.push({
      page: i,
      active: page === i,
    });
  }
  const maxLength = maxButtons >= 4 ? maxButtons : 4;
  if (totalPages <= maxLength) return PagesArray;
  const isEndPage = page !== 1 && page !== totalPages;
  const maxFlexButtons = maxLength - 2;
  const pageIndex = PagesArray.findIndex((item) => item.active);
  const flexMidpoint = Math.floor(maxFlexButtons / 2);

  const Before: Array<PagesArrayObject> =
    pageIndex - maxFlexButtons >= 0
      ? PagesArray.slice(pageIndex - maxFlexButtons, pageIndex)
      : PagesArray.slice(0, pageIndex);
  const After: Array<PagesArrayObject> = PagesArray.slice(
    pageIndex,
    isEndPage ? pageIndex + maxFlexButtons : page + maxFlexButtons
  );

  const beforeAfterLength = Before.length + After.length;
  const beforeHasFirst = !!Before.find((info) => info.page === 1);
  const afterHasLast = !!After.find((info) => info.page === totalPages);

  if (beforeAfterLength >= maxLength) {
    // too many buttons on either array, need to shrink them.
    if (beforeHasFirst && Before.length <= flexMidpoint) {
      // within flexLength of first page
      After.splice(After.length - (Before.length - 1));
    } else if (afterHasLast && After.length <= flexMidpoint + 2) {
      // within flexLength of last page
      Before.splice(0, After.length - 1);
    } else {
      // within flexlength of neither end
      Before.splice(0, Before.length - flexMidpoint);
      After.splice(Math.abs(flexMidpoint - After.length - (After.length === maxFlexButtons ? 0 : 1)));
    }
  }

  let ArrayToShow: Array<PagesArrayObject> = Before.concat(After);

  // add first page:
  if (page !== 1 && !Before.find((info) => info.page === 1)) ArrayToShow.unshift(PagesArray[0]);

  // add final page:
  if (page !== totalPages && !After.find((info) => info.page === totalPages))
    ArrayToShow.push(PagesArray[PagesArray.length - 1]);

  // finally add nullPages:
  if (ArrayToShow[1].page !== 2) ArrayToShow[1] = NullPage;
  if (ArrayToShow[ArrayToShow.length - 2].page !== totalPages - 1) ArrayToShow[ArrayToShow.length - 2] = NullPage;

  return ArrayToShow;
};

export const Pagination = ({
  page,
  action,
  itemCount,
  itemsPerPage = 10,
  showPagination = true,
  useFull = false,
  maxButtons = 7,
}: PaginationProps) => {
  const totalPages = Math.ceil(itemCount / (itemsPerPage || 10)) || 1;
  const pagesArray = createPagesArray(page, totalPages, maxButtons);
  return (
    <div
      className={classNames(Styles.Pagination, {
        [Styles.Full]: useFull,
      })}
    >
      {showPagination && (
        <section>
          <SecondaryThemeButton action={() => action(page - 1)} disabled={page === 1} icon={SimpleChevron} />
          {handleMiddle({ page, totalPages, pagesArray, action, useFull })}
          <SecondaryThemeButton
            action={() => action(page + 1)}
            disabled={page === totalPages || totalPages === 0}
            icon={SimpleChevron}
          />
        </section>
      )}
    </div>
  );
};

const handleMiddle = ({ page, totalPages, pagesArray, action, useFull = false }) => {
  const content = useFull ? (
    <>
      {pagesArray.map((pageInfo, index) =>
        pageInfo.page ? (
          <TinyThemeButton
            key={`pagination-detail-button-for-page-${pageInfo.page}`}
            selected={pageInfo.active}
            text={pageInfo.page}
            noHighlight
            action={() => action(pageInfo.page)}
          />
        ) : (
          <div key={`ellipsis-for-${index}`}>...</div>
        )
      )}
    </>
  ) : null;

  return (
    <>
      <span>
        Page {page} of {totalPages}
      </span>
      {content}
    </>
  );
};
