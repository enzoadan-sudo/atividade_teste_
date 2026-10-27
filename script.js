// ================== DADOS ==================
const CHAVE = "gol-em-foco-noticias";

// Notícias de exemplo (sem imagem: usam um fundo verde com bola)
const noticiasExemplo = [
  {
    id: 1, categoria: "Brasileirão", data: "2026-10-26", exemplo: true,
    titulo: "Líder vence clássico e abre vantagem na tabela",
    texto: "Em jogo disputado até os acréscimos, o líder do campeonato garantiu três pontos importantes e ampliou a distância para o segundo colocado.",
    imagem: "whatsapp-image-2026-10-26-at-21.25.57.jpg"
  },
  {
    id: 2, categoria: "Libertadores", data: "2026-10-25", exemplo: true,
    titulo: "Semifinal da Libertadores terá duelo brasileiro",
    texto: "Os confrontos foram definidos e os torcedores já se preparam para dois jogos decisivos pela vaga na final continental.",
    imagem: "imgS300I1225635T20261013013036.jpg"
  },
  {
    id: 3, categoria: "Seleção", data: "2026-10-24", exemplo: true,
    titulo: "Técnico divulga lista de convocados para as Eliminatórias",
    texto: "A convocação traz novidades no meio-campo e o retorno de jogadores que estavam fora das últimas listas.",
    imagem: "images.jpg"
  },
  {
    id: 4, categoria: "Mercado", data: "2026-10-23", exemplo: true,
    titulo: "Atacante é especulado em gigante europeu",
    texto: "Clube europeu monitora o jogador e pode apresentar proposta na próxima janela de transferências.",
    imagem: "W35TVWYC75FABIIPNB6WSEOCIU.avif"
  },
  {
    id: 5, categoria: "Internacional", data: "2026-10-22", exemplo: true,
    titulo: "Campeonato inglês tem rodada de viradas emocionantes",
    texto: "Três jogos terminaram com gols nos minutos finais, embolando a briga pelo topo da tabela.",
    imagem: "images (1).jpg"
  }
];

let noticiasUsuario = carregar();
let categoriaAtual = "Todas";
let termoBusca = "";
const MAX_IMAGENS = 3;
let imagensSelecionadas = []; // dataURLs ou URLs

// ================== ELEMENTOS ==================
const grade = document.getElementById("grade");
const destaque = document.getElementById("destaque");
const vazio = document.getElementById("vazio");
const menu = document.getElementById("menu");
const busca = document.getElementById("busca");
const form = document.getElementById("form-noticia");
const inputArquivo = document.getElementById("imagem");
const inputUrl = document.getElementById("imagem-url");
const btnAddUrl = document.getElementById("add-url");
const previas = document.getElementById("previas");
const contador = document.getElementById("contador-img");

// ================== ARMAZENAMENTO ==================
function carregar() {
  try {
    return JSON.parse(localStorage.getItem(CHAVE)) || [];
  } catch {
    return [];
  }
}

function salvar() {
  try {
    localStorage.setItem(CHAVE, JSON.stringify(noticiasUsuario));
    return true;
  } catch {
    alert("Não foi possível salvar: o armazenamento do navegador está cheio. Tente excluir notícias antigas ou usar imagens menores.");
    return false;
  }
}

// ================== RENDERIZAÇÃO ==================
function todasNoticias() {
  return [...noticiasUsuario, ...noticiasExemplo].sort((a, b) => {
    if (a.data !== b.data) return a.data < b.data ? 1 : -1;
    return b.id - a.id;
  });
}

function filtradas() {
  return todasNoticias().filter(n => {
    const okCat = categoriaAtual === "Todas" || n.categoria === categoriaAtual;
    const alvo = (n.titulo + " " + n.texto).toLowerCase();
    return okCat && alvo.includes(termoBusca);
  });
}

function escapar(t) {
  const d = document.createElement("div");
  d.textContent = t;
  return d.innerHTML;
}

function formatarData(iso) {
  const [a, m, d] = iso.split("-");
  return `${d}/${m}/${a}`;
}

function imagensDe(n) {
  return n.imagens || (n.imagem ? [n.imagem] : []);
}

function midiaHTML(n, classe) {
  const imgs = imagensDe(n);
  return imgs.length
    ? `<img class="${classe}" src="${imgs[0]}" alt="${escapar(n.titulo)}">`
    : `<div class="sem-imagem">⚽</div>`;
}

function miniaturasHTML(n) {
  const extras = imagensDe(n).slice(1);
  if (!extras.length) return "";
  return `<div class="miniaturas">${extras.map(src =>
    `<img src="${src}" alt="${escapar(n.titulo)}">`).join("")}</div>`;
}

function renderizar() {
  const lista = filtradas();

  vazio.hidden = lista.length > 0;
  destaque.hidden = lista.length === 0;
  grade.innerHTML = "";
  if (lista.length === 0) return;

  // Destaque = primeira notícia
  const d = lista[0];
  destaque.innerHTML = `
    ${imagensDe(d).length ? `<img class="capa" src="${imagensDe(d)[0]}" alt="${escapar(d.titulo)}">` : `<div class="sem-imagem"></div>`}
    <div class="conteudo">
      <span class="etiqueta">${escapar(d.categoria)}</span>
      <h1>${escapar(d.titulo)}</h1>
      <p>${escapar(d.texto)}</p>
      ${miniaturasHTML(d)}
    </div>
  `;

  // Demais notícias
  lista.slice(1).forEach(n => {
    const card = document.createElement("article");
    card.className = "card";
    card.innerHTML = `
      <div class="capa-wrap">${midiaHTML(n, "capa")}</div>
      ${miniaturasHTML(n)}
      <div class="corpo">
        <span class="etiqueta">${escapar(n.categoria)}</span>
        <h3>${escapar(n.titulo)}</h3>
        <p>${escapar(n.texto.length > 110 ? n.texto.slice(0, 110) + "…" : n.texto)}</p>
        <div class="rodape-card">
          <span>${formatarData(n.data)}</span>
          ${n.exemplo ? "" : `<button class="btn-excluir" data-id="${n.id}">Excluir</button>`}
        </div>
      </div>
    `;
    grade.appendChild(card);
  });
}

// ================== EVENTOS ==================
menu.addEventListener("click", e => {
  const btn = e.target.closest(".menu-item");
  if (!btn) return;
  document.querySelectorAll(".menu-item").forEach(b => b.classList.remove("ativo"));
  btn.classList.add("ativo");
  categoriaAtual = btn.dataset.categoria;
  renderizar();
});

busca.addEventListener("input", () => {
  termoBusca = busca.value.trim().toLowerCase();
  renderizar();
});

grade.addEventListener("click", e => {
  const btn = e.target.closest(".btn-excluir");
  if (!btn) return;
  if (!confirm("Excluir esta notícia?")) return;
  noticiasUsuario = noticiasUsuario.filter(n => n.id !== Number(btn.dataset.id));
  salvar();
  renderizar();
});

// ---------- Imagens (até 3) ----------
function atualizarPrevias() {
  contador.textContent = `${imagensSelecionadas.length} de ${MAX_IMAGENS} imagens`;
  previas.innerHTML = "";
  imagensSelecionadas.forEach((src, i) => {
    const item = document.createElement("div");
    item.className = "previa-item";
    item.innerHTML = `<img src="${src}" alt="Pré-visualização ${i + 1}">
      <button type="button" class="remover" data-i="${i}" aria-label="Remover imagem ${i + 1}">×</button>
      ${i === 0 ? '<span class="tag-capa">Capa</span>' : ""}`;
    previas.appendChild(item);
  });
}

function adicionarImagem(src) {
  if (imagensSelecionadas.length >= MAX_IMAGENS) {
    alert(`Você pode adicionar no máximo ${MAX_IMAGENS} imagens.`);
    return false;
  }
  imagensSelecionadas.push(src);
  atualizarPrevias();
  return true;
}

inputArquivo.addEventListener("change", () => {
  const arquivos = [...inputArquivo.files];
  inputArquivo.value = "";
  const vagas = Math.max(MAX_IMAGENS - imagensSelecionadas.length, 0);
  if (arquivos.length > vagas) {
    alert(`Só cabem mais ${vagas} imagem(ns). As demais foram ignoradas.`);
  }
  arquivos.slice(0, vagas).forEach(arquivo => {
    if (!arquivo.type.startsWith("image/")) return;
    const leitor = new FileReader();
    leitor.onload = () => reduzirImagem(leitor.result, 1000, dataUrl => adicionarImagem(dataUrl));
    leitor.readAsDataURL(arquivo);
  });
});

btnAddUrl.addEventListener("click", () => {
  const url = inputUrl.value.trim();
  if (!url) return;
  if (adicionarImagem(url)) inputUrl.value = "";
});

inputUrl.addEventListener("keydown", e => {
  if (e.key === "Enter") {
    e.preventDefault();
    btnAddUrl.click();
  }
});

previas.addEventListener("click", e => {
  const btn = e.target.closest(".remover");
  if (!btn) return;
  imagensSelecionadas.splice(Number(btn.dataset.i), 1);
  atualizarPrevias();
});

// Reduz a imagem para economizar espaço no navegador
function reduzirImagem(dataUrl, larguraMax, callback) {
  const img = new Image();
  img.onload = () => {
    const escala = Math.min(1, larguraMax / img.width);
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(img.width * escala);
    canvas.height = Math.round(img.height * escala);
    canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
    callback(canvas.toDataURL("image/jpeg", 0.8));
  };
  img.onerror = () => alert("Não foi possível carregar essa imagem.");
  img.src = dataUrl;
}

// ---------- Publicar ----------
form.addEventListener("submit", e => {
  e.preventDefault();

  const nova = {
    id: Date.now(),
    titulo: document.getElementById("titulo").value.trim(),
    categoria: document.getElementById("categoria").value,
    texto: document.getElementById("texto").value.trim(),
    imagens: [...imagensSelecionadas],
    data: new Date().toISOString().slice(0, 10)
  };

  noticiasUsuario.unshift(nova);
  if (!salvar()) {
    noticiasUsuario.shift();
    return;
  }

  form.reset();
  imagensSelecionadas = [];
  atualizarPrevias();

  // volta para "Todas" para a notícia aparecer
  categoriaAtual = "Todas";
  termoBusca = "";
  busca.value = "";
  document.querySelectorAll(".menu-item").forEach(b =>
    b.classList.toggle("ativo", b.dataset.categoria === "Todas")
  );
  renderizar();
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// ================== INÍCIO ==================
atualizarPrevias();
renderizar();