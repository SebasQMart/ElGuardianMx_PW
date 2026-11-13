"use client";

import { useCallback } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import type { JSONContent } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";

type EditorContenidoProps = {
  contenido: JSONContent;
  onChange: (contenido: JSONContent) => void;
};

export default function EditorContenido({
  contenido,
  onChange,
}: EditorContenidoProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: false,
        autolink: true,
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],
    content: contenido,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getJSON());
    },
    editorProps: {
      attributes: {
        class:
          "min-h-[300px] p-4 text-sm text-slate-800 outline-none " +
          "[&_p]:mb-3 [&_h2]:mb-3 [&_h2]:mt-5 [&_h2]:text-2xl " +
          "[&_h2]:font-bold [&_h3]:mb-2 [&_h3]:mt-4 [&_h3]:text-xl " +
          "[&_h3]:font-semibold [&_ul]:mb-3 [&_ul]:list-disc " +
          "[&_ul]:pl-6 [&_ol]:mb-3 [&_ol]:list-decimal " +
          "[&_ol]:pl-6 [&_blockquote]:my-4 [&_blockquote]:border-l-4 " +
          "[&_blockquote]:border-slate-300 [&_blockquote]:pl-4 " +
          "[&_blockquote]:italic [&_a]:text-blue-600 [&_a]:underline",
      },
    },
  });

  const agregarEnlace = useCallback(() => {
    if (!editor) return;

    const url = window.prompt("Introduce la dirección del enlace:");

    if (url === null) return;

    if (!url.trim()) {
      editor.chain().focus().unsetLink().run();
      return;
    }

    editor.chain().focus().setLink({ href: url.trim() }).run();
  }, [editor]);

  if (!editor) {
    return (
      <div className="min-h-75 rounded-lg border border-slate-300 bg-white p-4 text-sm text-slate-400">
        Preparando editor...
      </div>
    );
  }

  const botones = [
    {
      nombre: "Negrita",
      accion: () => editor.chain().focus().toggleBold().run(),
      activo: editor.isActive("bold"),
      texto: "B",
      estilo: "font-bold",
    },
    {
      nombre: "Cursiva",
      accion: () => editor.chain().focus().toggleItalic().run(),
      activo: editor.isActive("italic"),
      texto: "I",
      estilo: "italic",
    },
    {
      nombre: "Subrayado",
      accion: () => editor.chain().focus().toggleUnderline().run(),
      activo: editor.isActive("underline"),
      texto: "U",
      estilo: "underline",
    },
  ];

  return (
    <div className="overflow-hidden rounded-lg border border-slate-300 bg-white">
      <div className="flex flex-wrap items-center gap-1 border-b border-slate-200 bg-slate-50 p-2">
        {botones.map((boton) => (
          <button
            key={boton.nombre}
            type="button"
            title={boton.nombre}
            aria-label={boton.nombre}
            aria-pressed={boton.activo}
            onClick={boton.accion}
            className={`flex h-9 min-w-9 items-center justify-center rounded px-2 text-sm text-slate-700 transition hover:bg-slate-200 ${
              boton.activo ? "bg-slate-200" : ""
            } ${boton.estilo}`}
          >
            {boton.texto}
          </button>
        ))}

        <div className="mx-1 h-6 border-l border-slate-300" />

        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={`rounded px-2 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200 ${
            editor.isActive("heading", { level: 2 }) ? "bg-slate-200" : ""
          }`}
        >
          H2
        </button>

        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          className={`rounded px-2 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200 ${
            editor.isActive("heading", { level: 3 }) ? "bg-slate-200" : ""
          }`}
        >
          H3
        </button>

        <div className="mx-1 h-6 border-l border-slate-300" />

        <button
          type="button"
          title="Lista con viñetas"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`rounded px-3 py-2 text-sm text-slate-700 hover:bg-slate-200 ${
            editor.isActive("bulletList") ? "bg-slate-200" : ""
          }`}
        >
          • Lista
        </button>

        <button
          type="button"
          title="Lista numerada"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`rounded px-3 py-2 text-sm text-slate-700 hover:bg-slate-200 ${
            editor.isActive("orderedList") ? "bg-slate-200" : ""
          }`}
        >
          1. Lista
        </button>

        <div className="mx-1 h-6 border-l border-slate-300" />

        <button
          type="button"
          title="Insertar enlace"
          onClick={agregarEnlace}
          className={`rounded px-3 py-2 text-sm text-slate-700 hover:bg-slate-200 ${
            editor.isActive("link") ? "bg-slate-200" : ""
          }`}
        >
          Enlace
        </button>

        <div className="mx-1 h-6 border-l border-slate-300" />

        {(["left", "center", "right"] as const).map((alineacion) => (
          <button
            key={alineacion}
            type="button"
            title={`Alinear ${alineacion === "left" ? "a la izquierda" : alineacion === "center" ? "al centro" : "a la derecha"}`}
            onClick={() =>
              editor.chain().focus().setTextAlign(alineacion).run()
            }
            className={`rounded px-2 py-2 text-xs text-slate-700 hover:bg-slate-200 ${
              editor.isActive({ textAlign: alineacion }) ? "bg-slate-200" : ""
            }`}
          >
            {alineacion === "left"
              ? "Izq."
              : alineacion === "center"
                ? "Centro"
                : "Der."}
          </button>
        ))}
      </div>

      <EditorContent editor={editor} />
    </div>
  );
}
