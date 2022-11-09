export const customStyles = {
  headCells: {
    style: {
      fontWeight: "bold",
      textTransform: "uppercase",
      fontSize: "12px",
      alignItems: "center",
    },
  },
  rows: {
    style: {
      //   minHeight: "72px",
    },
  },
  cells: {
    style: {},
  },
};

export const quillModules = {
  toolbar: [
    [{ header: "1" }, { header: "2" }, { font: [] }],
    [{ size: [] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [{ align: [] }],
    [{ color: [] }, { background: [] }],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
    ["clean"],
  ],
};

export const quillFormat = [
  "header",
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "color",
  "background",
  "list",
  "bullet",
  "indent",
  "link",
  "video",
  "image",
  "code-block",
  "align",
];
