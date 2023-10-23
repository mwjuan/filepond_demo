import React, { useState } from 'react'
import { Tabs } from 'antd';
import { FilePond, registerPlugin } from 'react-filepond'
import 'filepond/dist/filepond.min.css'
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css'
// Import the editor styles
import '@pqina/pintura/pintura.css';

// Import the editor functionality
import {
  // Import the default image reader and writer
  createDefaultImageReader,
  createDefaultImageWriter,

  // The method used to register the plugins
  setPlugins,

  // The plugins we want to use
  plugin_crop,
  plugin_finetune,
  plugin_annotate,

  // The user interface and plugin locale objects
  locale_en_gb,
  plugin_crop_locale_en_gb,
  plugin_finetune_locale_en_gb,
  plugin_annotate_locale_en_gb,

  // Because we use the annotate plugin we also need
  // to import the markup editor locale and the shape preprocessor
  markup_editor_locale_en_gb,
  createDefaultShapePreprocessor,

  // Import the default configuration for the markup editor and finetune plugins
  markup_editor_defaults,
  plugin_finetune_defaults,
} from '@pqina/pintura';

// Import the editor component from `react-pintura`
import { PinturaEditor } from '@pqina/react-pintura';

// This registers the plugins with Pintura Image Editor
setPlugins(plugin_crop, plugin_finetune, plugin_annotate);

// Create our editor configuration
const editorConfig = {
  // This will read the image data (required)
  imageReader: createDefaultImageReader(),

  // This will write the output image
  imageWriter: createDefaultImageWriter(),

  // The markup editor default options, tools, shape style controls
  ...markup_editor_defaults,

  // The finetune util controls
  ...plugin_finetune_defaults,

  // This handles complex shapes like arrows / frames
  shapePreprocessor: createDefaultShapePreprocessor(),

  // This will set a square crop aspect ratio
  imageCropAspectRatio: 1,

  // The icons and labels to use in the user interface (required)
  locale: {
    ...locale_en_gb,
    ...plugin_crop_locale_en_gb,
    ...plugin_finetune_locale_en_gb,
    ...plugin_annotate_locale_en_gb,
    ...markup_editor_locale_en_gb,
  },
};

registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview)

function App() {
  const [files, setFiles] = useState([])
  const onprocessfile = (error, file) => {
    console.log(error, JSON.parse(file.serverId))
  }

  const items = [
    {
      key: "1", label: '文件上传',
      children: <div style={{ width: 700, height: 800, }}>
        <FilePond
          files={files}
          onupdatefiles={setFiles}
          allowMultiple={true}
          maxFiles={3}
          server={{
            url: "http://172.16.40.191/api/v1/file",
            headers: {
              'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyT2JqZWN0SWQiOiI2NDg2ZGU4NDUwZDRjYzQ1Njg2NjVmYTUiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE2OTgwNDU5OTcsImV4cCI6MTcwMDYzNzk5N30.NFfjbVa18FpOLhsN_wNY06d7idwVTAHMwYwmbjAjcuo',
            }
          }}
          name="file"
          labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
          onprocessfile={onprocessfile}
        />
      </div>
    },
    {
      key: "2", label: '图片美化',
      children: <div style={{ height: 600 }}>
        <PinturaEditor
          {...editorConfig}
          src="https://p6-pc-sign.douyinpic.com/tos-cn-i-0813/d929600873474ca2aaa9b40b05427152~noop.jpeg?biz_tag=pcweb_cover&from=3213915784&s=PackSourceEnum_SEARCH&se=false&x-expires=1699088400&x-signature=e3hcypKbKrnL22gvv1T5q6fzCNU%3D"
          imageCropAspectRatio={1}
        ></PinturaEditor>
      </div>
    }
  ]
  return (
    <div className="App">
      <Tabs defaultActiveKey='1' items={items} style={{ margin: 20 }} />
    </div>
  );
}

export default App;
