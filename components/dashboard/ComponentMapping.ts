import Form from "./Form";
import Tabs from "./Tabs";
import Section from "./Section";
import Switch from "./Switch";
import TextArea from "./TextArea";
import Dropdown from "./Dropdown";
// import Graph from "./Graph";
import { LineChartAL } from "./charts/LineChartAL";
import { LineChartOVC } from "./charts/LineChartOVC";
import { LineChartMin } from "./charts/LineChartMin";
// import Switch from "./Switch";
// import Radio from "./Radio";
// import Slider from "./Slider";

const componentMap: Record<string, React.FC<any>> = {
  form: Form,
  tabs: Tabs,
  section: Section,
  switch: Switch,
  textArea: TextArea,
  dropdown: Dropdown,
  LineChartAL: LineChartAL,
  LineChartOVC: LineChartOVC,
  LineChartMin: LineChartMin,
  //   graph: Graph,
  //   switch: Switch,
  //   radio: Radio,
  //   slider: Slider,
};

export default componentMap;
