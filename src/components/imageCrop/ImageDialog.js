// import React, { useState, useRef } from "react";
// import Default from "../../test.jpg";
// import Cropper from "react-cropper";
// import "./ImageStyles.css";
// import "cropperjs/dist/cropper.css";

// export default function ImageDialog() {
//   const [image, setImage] = useState(Default);
//   const [cropData, setCropData] = useState("#");
//   // const crop = new Cropper();
//   const [cropper, setCropper] = useState();
//   const imageRef = useRef(null);

//   const onChange = (e) => {
//     e.preventDefault();
//     let files;
//     if (e.dataTransfer) {
//       files = e.dataTransfer.files;
//     } else if (e.target) {
//       files = e.target.files;
//     }
//     const reader = new FileReader();
//     reader.onload = () => {
//       setImage(reader.result);
//     };
//     reader.readAsDataURL(files[0]);
//   };

//   const getCropData = () => {
//     if (typeof cropper !== "undefined") {
//       setCropData(cropper.getCroppedCanvas().toDataURL());
//     }
//   };

//   return (
//     <>
//       <div style={{ width: "100%" }}>
//         <input type="file" onChange={onChange} />
//         <button>Use default img</button>
//         <br />
//         <br />
//         <Cropper
//           style={{ height: 400, width: "100%" }}
//           // initialAspectRatio={1}
//           aspectRatio={1}
//           preview=".img-preview"
//           src={image}
//           ref={imageRef}
//           viewMode={1}
//           guides={true}
//           minCropBoxHeight={10}
//           minCropBoxWidth={10}
//           background={false}
//           responsive={true}
//           checkOrientation={false} // https://github.com/fengyuanchen/cropperjs/issues/671
//           onInitialized={(instance) => {
//             setCropper(instance);
//           }}
//           cropBoxMovable={false}
//           cropBoxResizable={false}
//         />
//       </div>
//       <div>
//         <div className="box" style={{ width: "50%", float: "right" }}>
//           <h1>Preview</h1>
//           <div
//             className="img-preview"
//             style={{ width: "100%", float: "left", height: "300px" }}
//           />
//         </div>
//         <div
//           className="box"
//           style={{ width: "400px", float: "right", height: "300px" }}
//         >
//           <h1>
//             <span>Crop</span>
//             <button style={{ float: "right" }} onClick={getCropData}>
//               Crop Image
//             </button>
//           </h1>
//           <img style={{ width: "100%" }} src={cropData} alt="cropped" />
//         </div>
//       </div>
//       <br style={{ clear: "both" }} />
//     </>
//   );
// }
import React from "react";
import defaultImg from "../../test.jpg";
import $ from "jquery";
import Swal from "sweetalert2";
window.$ = window.jQuery = require("jquery");

const ImageDialog = () => {
  const handleClick = () => {
    $(document).ready(function () {
      var FLIP = 2;
      var NORMAL = 1;
      var orientation = NORMAL;
      var $uploadCrop, tempFilename, rawImg, imageId;
      var fileTypes = ["jpg", "jpeg", "png"];
      function readFile(input) {
        if (input.files && input.files[0]) {
          var reader = new FileReader();
          var file = input.files[0]; // Get your file here
          var fileExt = file.type.split("/")[1]; // Get the file extension
          if (fileTypes.indexOf(fileExt) !== -1) {
            reader.onload = function (e) {
              $(".upload-demo").addClass("ready");
              $("#cropImagePop").modal("show");
              rawImg = e.target.result;
            };
            reader.readAsDataURL(input.files[0]);
          } else {
            Swal("Only JPEG, PNG, JPG file types are supported");
          }
        } else {
          Swal("Sorry - something went wrong");
        }
      }

      $uploadCrop = $("#upload-demo").croppie({
        viewport: {
          width: 480,
          height: 270,
          // type: 'square'
        },
        enableOrientation: true,
        enforceBoundary: false,
        enableExif: true,
        enableResize: true,
      });
      $("#cropImagePop").on("shown.bs.modal", function () {
        // alert('Shown pop');
        $uploadCrop
          .croppie("bind", {
            url: rawImg,
          })
          .then(function () {
            // console.log('jQuery bind complete');
          });
      });
      $("#Flip").click(function () {
        orientation = orientation == NORMAL ? FLIP : NORMAL;
        $uploadCrop.croppie("bind", {
          url: rawImg,
          orientation: orientation,
        });
      });
      $("#rotate").click(function () {
        $uploadCrop.croppie("rotate", parseInt($(this).data("deg")));
      });
      $(".item-img").on("change", function () {
        imageId = $(this).data("id");
        tempFilename = $(this).val();
        $("#cancelCropBtn").data("id", imageId);
        readFile(this);
      });
      $("#cropImageBtn").on("click", function (ev) {
        $uploadCrop
          .croppie("result", {
            type: "base64",
            format: "jpeg",
            size: { width: 1280, height: 720 },
          })
          .then(function (resp) {
            $("#item-img-output").attr("src", resp);
            $("#main_image").attr("value", resp);
            $("#cropImagePop").modal("hide");
          });
      });
    });
  };

  return (
    <>
      <div className="media mb-2 col-md-6">
        <img
          src={defaultImg}
          className="gambar old_profile_imageSub user-avatar users-avatar-shadow rounded mr-2 my-25 cursor-pointer"
          id="item-img-output"
          name="avatar"
          style={{ objectFit: "cover" }}
          height="90"
          width="90"
        />
        <div className="media-body mt-50">
          <label className=" control-label" htmlFor="coupan_image">
            Product Image
          </label>
          <div className="d-flex px-0">
            <input type="hidden" name="main_image" value="" id="main_image" />
            <input
              type="file"
              accept="image/png, image/jpeg, image/jpg"
              className="item-img file form-control "
              name="file_photo"
              onChange={handleClick}
            />
          </div>
        </div>
        <div className="form-group ">
          <div className="col-md-8 vc_column-inner ">
            <div
              className="modal fade"
              id="cropImagePop"
              tabIndex="-1"
              role="dialog"
              aria-labelledby="myModalLabel"
              aria-hidden="true"
            >
              <div className="modal-dialog  modal-lg">
                <div className="modal-content">
                  <div className="modal-header">
                    <button
                      type="button"
                      className="close"
                      data-dismiss="modal"
                      aria-label="Close"
                    >
                      <span aria-hidden="true">×</span>
                    </button>
                    <h4 className="modal-title" id="myModalLabel" />
                  </div>
                  <div className="modal-body">
                    <div
                      id="upload-demo"
                      className="center-block"
                      style={{ height: "600px" }}
                    ></div>
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-default"
                      data-dismiss="modal"
                    >
                      Close
                    </button>
                    <button type="button" className="btn btn-default" id="Flip">
                      Flip
                    </button>
                    <button
                      type="button"
                      id="cropImageBtn"
                      className="btn btn-primary"
                    >
                      Crop
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ImageDialog;
