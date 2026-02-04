'use strict';
'require view';
'require fs';

return view.extend({
  tinyFmPaths: [
    {
      base: '/www/tinyfm',
      files: [
        'tinyfm.php',
        'index.php'
      ],
      urls: [
        '/tinyfm/tinyfm.php?p=etc%2Fnikki',
        '/tinyfm/index.php?p=etc%2Fnikki'
      ]
    },
    {
      base: '/www/tinyfilemanager',
      files: [
        'tinyfilemanager.php',
        'index.php'
      ],
      urls: [
        '/tinyfilemanager/tinyfilemanager.php?p=etc%2Fnikki',
        '/tinyfilemanager/index.php?p=etc%2Fnikki'
      ]
    }
  ],

  async findValidPath() {
    for (const item of this.tinyFmPaths) {
      try {
        const dir = await fs.stat(item.base);
        if (!dir || dir.type !== 'directory')
          continue;

        for (const file of item.files) {
          try {
            const st = await fs.stat(`${item.base}/${file}`);
            if (st && st.type === 'file') {
              /* file ada → pakai URL dengan etc%2Fnikki */
              return item.urls[0];
            }
          } catch (e) {}
        }
      } catch (e) {}
    }
    return null;
  },

  load() {
    return this.findValidPath();
  },

  render(iframePath) {
    if (!iframePath) {
      return E('div', { class: 'cbi-section' }, [
        E('div', {
          style: 'color:red;padding:20px;border:1px solid #ccc;border-radius:8px'
        }, _('TinyFileManager not found. Please install it.'))
      ]);
    }

    return E('div', { class: 'cbi-section' }, [
      E('iframe', {
        src: iframePath,
        style: 'width:100%; height:80vh; border:none;'
      })
    ]);
  }
});
