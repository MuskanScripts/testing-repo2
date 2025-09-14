(function(){
  const { useEffect, useState, useMemo, createElement: h } = React;

  function SectionTitle({ text }) {
    return h('h2', { className: 'section-title bg-white text-start text-primary pe-3' }, text);
  }

  function CounterCard() {
    const [count, setCount] = useState(0);
    return h('div', { className: 'card shadow-sm mb-3' },
      h('div', { className: 'card-body d-flex align-items-center justify-content-between' },
        h('div', null,
          h('h5', { className: 'card-title mb-1' }, 'Interactive Counter'),
          h('p', { className: 'card-text text-muted mb-0' }, 'This component is powered by React inside Handlebars.')
        ),
        h('div', { className: 'btn-group' },
          h('button', { className: 'btn btn-outline-primary', onClick: () => setCount(c => c - 1) }, '-'),
          h('span', { className: 'px-3' }, String(count)),
          h('button', { className: 'btn btn-primary', onClick: () => setCount(c => c + 1) }, '+')
        )
      )
    );
  }

  function ResourcesList() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
      fetch('/get-academics-sem-list').then(r => {
        if(!r.ok) throw new Error('Failed to load');
        return r.json();
      }).then(data => {
        setItems(Array.isArray(data) ? data : []);
      }).catch(e => setError(e.message)).finally(()=> setLoading(false));
    }, []);

    if (loading) return h('div', { className: 'd-flex align-items-center' },
      h('strong', null, 'Loading...'),
      h('div', { className: 'spinner-border ms-auto', role: 'status', 'aria-hidden': 'true' })
    );
    if (error) return h('div', { className: 'alert alert-danger' }, error);

    return h('div', { className: 'row g-3' }, items.map((it) =>
      h('div', { key: it.name, className: 'col-md-4' },
        h('div', { className: 'border rounded p-3 h-100' },
          h('div', { className: 'd-flex align-items-center justify-content-between' },
            h('span', { className: 'fw-semibold' }, it.name),
            h('a', { href: `/semester?sem=${encodeURIComponent(it.name)}`, className: 'btn btn-sm btn-primary' }, 'Open')
          )
        )
      )
    ));
  }

  function App() {
    return h('div', { className: 'react-app-container' },
      h(SectionTitle, { text: 'Hybrid MERN App' }),
      h('p', { className: 'mb-4' }, 'This React SPA is mounted within the existing Handlebars layout.'),
      h(CounterCard),
      h('hr', { className: 'my-4' }),
      h('h3', { className: 'mb-3' }, 'Academic Semesters'),
      h(ResourcesList)
    );
  }

  const rootEl = document.getElementById('app-root');
  if (rootEl) {
    const root = ReactDOM.createRoot(rootEl);
    root.render(h(App));
  }
})();
