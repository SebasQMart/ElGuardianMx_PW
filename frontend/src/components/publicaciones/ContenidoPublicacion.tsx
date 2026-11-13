
import type { JSONContent } from "@tiptap/core";

type ContenidoPublicacionProps = {
  contenido: Record<string, unknown>;
};

function esDocumentoTiptap(
  contenido: Record<string, unknown>,
): contenido is Record<string, unknown> & JSONContent {
  return contenido.type === "doc" && Array.isArray(contenido.content);
}

function renderizarNodo(nodo: JSONContent, indice: number): React.ReactNode {
  const contenido = nodo.content?.map((hijo, i) =>
    renderizarNodo(hijo, i),
  );

  const texto = nodo.text ?? "";

  let elemento: React.ReactNode;

  switch (nodo.type) {
    case "doc":
      elemento = contenido;
      break;

    case "paragraph":
      elemento = <p key={indice}>{contenido}</p>;
      break;

    case "heading":
      if (nodo.attrs?.level === 2) {
        elemento = <h2 key={indice}>{contenido}</h2>;
      } else {
        elemento = <h3 key={indice}>{contenido}</h3>;
      }
      break;

    case "bulletList":
      elemento = <ul key={indice}>{contenido}</ul>;
      break;

    case "orderedList":
      elemento = <ol key={indice}>{contenido}</ol>;
      break;

    case "listItem":
      elemento = <li key={indice}>{contenido}</li>;
      break;

    case "blockquote":
      elemento = <blockquote key={indice}>{contenido}</blockquote>;
      break;

    case "hardBreak":
      elemento = <br key={indice} />;
      break;

    case "horizontalRule":
      elemento = <hr key={indice} />;
      break;

    case "text": {
      let resultado: React.ReactNode = texto;

      for (const marca of nodo.marks ?? []) {
        switch (marca.type) {
          case "bold":
            resultado = <strong>{resultado}</strong>;
            break;
          case "italic":
            resultado = <em>{resultado}</em>;
            break;
          case "underline":
            resultado = <u>{resultado}</u>;
            break;
          case "strike":
            resultado = <s>{resultado}</s>;
            break;
          case "link": {
            const href = marca.attrs?.href;

            if (
              typeof href === "string" &&
              /^https?:\/\//i.test(href)
            ) {
              resultado = (
                <a href={href} target="_blank" rel="noopener noreferrer">
                  {resultado}
                </a>
              );
            }

            break;
          }
        }
      }

      elemento = <span key={indice}>{resultado}</span>;
      break;
    }

    default:
      elemento = contenido;
  }

  const alineacion = nodo.attrs?.textAlign;

if (
  nodo.type !== "text" &&
  (alineacion === "left" ||
    alineacion === "center" ||
    alineacion === "right" ||
    alineacion === "justify")
) {
  return (
    <div key={indice} style={{ textAlign: alineacion }}>
      {elemento}
    </div>
  );
}

  return elemento;
}

export default function ContenidoPublicacion({
  contenido,
}: ContenidoPublicacionProps) {
  if (!esDocumentoTiptap(contenido)) {
    return (
      <p>
        El contenido de esta publicación todavía no está disponible.
      </p>
    );
  }

  return (
    <>
      {renderizarNodo(contenido as JSONContent, 0)}
    </>
  );
}
