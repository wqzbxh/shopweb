"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var core_1 = require("@mantine/core");
var dates_1 = require("@mantine/dates");
var form_1 = require("@mantine/form");
var react_1 = require("react");
var api_1 = require("../../../api");
var function_1 = require("../../../utils/function");
var RichTextEditor_1 = require("../../Common/RichTextEditor");
var timeProjectSelect = [
    { label: '项目A', value: '1' },
    { label: '项目B', value: '2' },
];
function TimeSheetForm(_a) {
    var _this = this;
    var callback = _a.callback, Data = _a.Data;
    //定义加载器
    var _b = react_1.useState(false), visible = _b[0], setVisible = _b[1];
    var _c = react_1.useState(0), projectid = _c[0], setProject = _c[1];
    var ref = react_1.useRef();
    console.log(Data);
    var form = form_1.useForm({
        initialValues: {
            id: Data.id,
            time_mark: Data.title,
            start_time: Data.start,
            time_project_id: Data.time_project_id,
            end_time: Data.end,
            time: Data.time
        },
        validate: {
            //   project_no: isNotEmpty('输入项目编号'),
            start_time: form_1.isNotEmpty('开始时间不能为空'),
            end_time: form_1.isNotEmpty('结束时间不能为空')
        }
    });
    var handleFormSubmit = function (event) { return __awaiter(_this, void 0, void 0, function () {
        var valid, response, method, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    event.preventDefault(); // Stop the formal submission of the form default
                    return [4 /*yield*/, form.validate()];
                case 1:
                    valid = _a.sent();
                    if (valid.hasErrors) {
                        function_1.ClientWarningHint(valid.errors);
                        return [2 /*return*/];
                    }
                    method = form.values.id ? "PUT" : "POST";
                    setVisible(true);
                    return [4 /*yield*/, api_1.apiTimeTracker(form.values, method)];
                case 2:
                    response = _a.sent();
                    setVisible(false);
                    result = response.data;
                    if (function_1.HintInfo(result))
                        callback(true);
                    return [2 /*return*/];
            }
        });
    }); };
    console.log(Data.time_project_id);
    function RichTextEditorCallBack(value) {
        console.log(value);
    }
    react_1.useEffect(function () {
        console.log(123);
        setProject(projectid + 1);
    }, [Data]);
    return (React.createElement(core_1.Box, { component: "form", mx: "auto", mih: 450, onSubmit: handleFormSubmit },
        React.createElement(core_1.Grid, null,
            React.createElement(core_1.Code, { block: true, mt: 5 }, JSON.stringify(form.values, null, 2)),
            React.createElement(core_1.Grid.Col, { span: 4 },
                React.createElement(core_1.Select, { label: "\u9009\u62E9\u9879\u76EE", searchable: true, data: timeProjectSelect, nothingFound: "No options", key: projectid, onChange: function (value) { return form.setFieldValue('time_project_id', value); }, defaultValue: form.values.time_project_id })),
            React.createElement(core_1.Grid.Col, { span: 4 },
                React.createElement(dates_1.DateTimePicker, __assign({ valueFormat: "YYYY-MM-DD HH:mm", label: "\u5F00\u59CB\u65F6\u95F4", defaultValue: new Date() }, form.getInputProps('start_time'), { placeholder: "\u5F00\u59CB\u65F6\u95F4", mx: "auto" })))),
        React.createElement(core_1.Grid, null,
            React.createElement(core_1.Grid.Col, { span: 4 },
                React.createElement(dates_1.TimeInput, __assign({ label: "\u65F6\u95F4\u82B1\u9500", description: '\u8F93\u5165\u540E\uFF0C\u7ED3\u675F\u65F6\u95F4\u5219\u4E3A\u5F53\u524D\u65F6\u95F4', placeholder: "\u8F93\u5165\u2026\u2026" }, form.getInputProps('time'), { mx: "auto" }))),
            React.createElement(core_1.Grid.Col, { span: 4 },
                React.createElement(dates_1.DateTimePicker, __assign({ valueFormat: "YYYY-MM-DD HH:mm", label: "\u7ED3\u675F\u65F6\u95F4", description: "\u8F93\u5165\u540E\u5C06\u81EA\u52A8\u8BA1\u7B97\u65F6\u95F4\u82B1\u9500", defaultValue: new Date() }, form.getInputProps('end_time'), { placeholder: "\u7ED3\u675F\u65F6\u95F4", mx: "auto" })))),
        React.createElement(RichTextEditor_1["default"], { content: "", callBack: RichTextEditorCallBack }),
        React.createElement(core_1.Group, { position: "right", mt: 30 },
            React.createElement(core_1.Button, { type: "submit" }, "\u4FDD\u5B58"))));
}
exports["default"] = TimeSheetForm;
