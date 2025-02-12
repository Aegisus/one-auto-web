import Form from "./Form";
import Tabs from "./Tabs";
import Section from "./Section";
import Switch from "./Switch";
import TextArea from "./TextArea";
import Dropdown from "./Dropdown";
// import Graph from "./Graph";
// import Chart from "./Chart";
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
  //   graph: Graph,
  //   chart: Chart,
  //   switch: Switch,
  //   radio: Radio,
  //   slider: Slider,
};

export default componentMap;
