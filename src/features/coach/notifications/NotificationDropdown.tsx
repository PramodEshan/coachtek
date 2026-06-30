import { IconChevLeft } from '@/components/icons';
import type { NotificationItem } from '@/services/types';

type NotificationVariant = 'mobile' | 'desktop';

interface NotificationDropdownProps {
  items: NotificationItem[];
  onClear: () => void;
  onClose: () => void;
  onTriggerSample?: () => void;
  variant: NotificationVariant;
}

function NotificationMenuContent({
  items,
  onClear,
  onClose,
  onTriggerSample,
  variant,
}: NotificationDropdownProps) {
  return (
    <>
      <div className="ct-notifications-menu-header">
        <div className="ct-notifications-menu-heading">
          <span className="ct-notifications-menu-title">Notifications</span>
          <span className="ct-notifications-menu-sub">Recent activity</span>
        </div>
        {items.length > 0 ? (
          <button type="button" className="ct-press ct-notifications-clear" onClick={onClear}>
            Clear all
          </button>
        ) : null}
      </div>

      <div className="ct-notifications-menu-list">
        {items.length === 0 ? (
          <div className="ct-notifications-empty">You&apos;re all caught up</div>
        ) : (
          items.map((item, i) => (
            <button
              key={item.id}
              type="button"
              className="ct-press ct-notifications-item"
              style={{ borderTop: i ? '1px solid var(--ct-divider)' : undefined }}
              onClick={variant === 'desktop' ? onClose : undefined}
            >
              <div className="ct-notifications-item-title">{item.title}</div>
              <div className="ct-notifications-item-sub">{item.sub}</div>
            </button>
          ))
        )}
      </div>

      {onTriggerSample ? (
        <div className="ct-notifications-dev">
          <button type="button" className="ct-press ct-notifications-trigger" onClick={onTriggerSample}>
            Add test notification
          </button>
        </div>
      ) : null}

      {variant === 'mobile' ? (
        <div className="ct-notifications-sheet-footer">
          <button type="button" className="ct-press ct-notifications-back" onClick={onClose}>
            <IconChevLeft size={18} />
            Back
          </button>
        </div>
      ) : null}
    </>
  );
}

export function NotificationDropdown({
  items,
  onClear,
  onClose,
  onTriggerSample,
  variant,
}: NotificationDropdownProps) {
  if (variant === 'desktop') {
    return (
      <div
        className="ct-notifications-menu is-desktop"
        role="dialog"
        aria-modal="true"
        aria-label="Notifications"
      >
        <NotificationMenuContent
          items={items}
          onClear={onClear}
          onClose={onClose}
          onTriggerSample={onTriggerSample}
          variant={variant}
        />
      </div>
    );
  }

  return (
    <div className="ct-notifications-backdrop is-mobile" onClick={onClose}>
      <div
        className="ct-notifications-menu ct-notifications-panel is-mobile"
        role="dialog"
        aria-modal="true"
        aria-label="Notifications"
        onClick={(event) => event.stopPropagation()}
      >
        <NotificationMenuContent
          items={items}
          onClear={onClear}
          onClose={onClose}
          onTriggerSample={onTriggerSample}
          variant={variant}
        />
      </div>
    </div>
  );
}
