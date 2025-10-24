(function () {
  'use strict';

  // Перевод
  Lampa.Lang.add({
    jellyfin_add: {
      ru: 'Добавить в Jellyfin',
      en: 'Add to Jellyfin',
      uk: 'Додати до Jellyfin'
    }
  });

  // Обработчик события 'torrent:onlong' — момент, когда формируется меню
  Lampa.Listener.follow('torrent', function (e) {
    if (e.type !== 'onlong' || !e.menu) return;

    // Добавляем новый пункт в меню
    e.menu.push({
      title: Lampa.Lang.translate('jellyfin_add'),
      jellyfin: true
    });
  });

  // Обработчик выбора в Select.show
  Lampa.Listener.follow('select', function (e) {
    if (!e.items || !Array.isArray(e.items)) return;

    // Ищем, есть ли в списке наш пункт
    const jellyfinItem = e.items.find(i => i.jellyfin);
    if (!jellyfinItem) return;

    // Сохраняем оригинальный onSelect
    const originalOnSelect = e.onSelect;

    // Подменяем onSelect, чтобы перехватить выбор
    e.onSelect = function (selected) {
      if (selected.jellyfin) {
        // Получаем данные торрента из контекста
        const item = e.context?.item || {};
        const element = e.context?.element || {};

        // Здесь реализуйте логику добавления в Jellyfin
        // Например, отправка запроса на ваш сервер или открытие URL
        addToJellyfin(item, element);
      } else if (originalOnSelect) {
        originalOnSelect(selected);
      }
    };
  });

  // Функция добавления торрента в Jellyfin
  function addToJellyfin(item, element) {
    // Пример: получаем magnet-ссылку или торрент-файл
    const torrentUrl = item.url || item.magnet || item.link;
    const title = item.title || item.name || 'Без названия';

    if (!torrentUrl) {
      Lampa.Noty.show(Lampa.Lang.translate('Нет ссылки на торрент'));
      return;
    }

    // Пример: отправка на ваш промежуточный сервер, который добавит в Jellyfin
    // Замените YOUR_JELLYFIN_ADD_URL на ваш реальный endpoint
    const jellyfinAddUrl = 'http://IP:9118/jellyfin/add?title=' + encodeURIComponent(title) + '&url=' + encodeURIComponent(torrentUrl);

    // Можно просто открыть URL (если сервер обрабатывает GET)
    // Или сделать fetch, если нужно фоновое добавление
    Lampa.Utils.request({
      url: jellyfinAddUrl,
      success: function () {
        Lampa.Noty.show('Добавлено в Jellyfin');
      },
      error: function () {
        Lampa.Noty.show('Ошибка добавления');
      }
    });
  }

  // Дополнительно: чтобы Select.show знал контекст (item/element), нужно его передать
  // Lampac обычно вызывает Select.show без контекста, поэтому перехватим вызов

  const originalSelectShow = Lampa.Select.show;
  Lampa.Select.show = function (params) {
    // Если это меню торрентов (проверяем по заголовку или наличию torrent-специфичных полей)
    if (params.title === Lampa.Lang.translate('title_action') && params.items && params.items.some(i => i.tomy !== undefined)) {
      // Сохраняем контекст из последнего torrent:onlong
      if (window.__lampac_torrent_context) {
        params.context = window.__lampac_torrent_context;
      }
    }
    return originalSelectShow.call(this, params);
  };

  // Сохраняем контекст при вызове onlong
  Lampa.Listener.follow('torrent', function (e) {
    if (e.type === 'onlong') {
      window.__lampac_torrent_context = { item: e.item, element: e.element };
    }
  });

})();