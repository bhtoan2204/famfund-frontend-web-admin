"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { setUser } from "@/redux/slices/user.slices";
import { AppDispatch, useAppSelector } from "@/redux/store";
import { ProfileRepository } from "@/repository/profile.repository";
import { ProfileUseCase } from "@/usecase/profile.usecase";
import { PlusOutlined } from "@ant-design/icons";
import type { GetProp, UploadProps } from "antd";
import {
  Button,
  DatePicker,
  Form,
  Image,
  Input,
  Select,
  Upload,
  UploadFile,
} from "antd";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { message } from "antd";
type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

const getBase64 = (file: FileType): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

const Settings = () => {
  const user = useAppSelector((state) => state.user.auth.user);
  const dispatch = useDispatch<AppDispatch>();
  const [form] = Form.useForm();
  const profileUsecase = new ProfileUseCase(new ProfileRepository());
  const router = useRouter();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState<UploadFile[]>();

  useEffect(() => {
    form.setFieldValue("firstname", user?.firstname);
    form.setFieldValue("lastname", user?.lastname);
    form.setFieldValue(
      "birthdate",
      dayjs(
        user?.birthdate.slice(0, 10).split("-").reverse().join("/"),
        "DD/MM/YYYY",
      ),
    );
    form.setFieldValue("genre", user?.genre);
  }, []);

  const handleSubmit = async (values: any) => {
    try {
      const response = await profileUsecase.updateProfile({
        firstname: values.firstname,
        lastname: values.lastname,
        birthdate: values.birthdate,
        genre: values.genre,
      });
      if (response.status === 200) {
        dispatch(setUser(response.data["0"]));
        message.success("Profile updated successfully!");
      } else {
        message.error("Failed to update profile.");
      }
    } catch (error) {
      message.error("Failed to update profile.");
      console.log(error);
    }
  };

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
      console.log(file.preview);
    }

    setPreviewImage(file.url ?? (file.preview as string));
    setPreviewOpen(true);
  };

  const handleChange: UploadProps["onChange"] = ({ fileList: newFileList }) =>
    setFileList(newFileList);

  const handleAvatarChange = async () => {
    profileUsecase.updateAvatar(fileList?.[0].thumbUrl as string);
  };

  const handleCancel = () => {
    setFileList(undefined);
  };

  return (
    <DefaultLayout>
      <div className="mx-auto max-w-270">
        <Breadcrumb pageName="Settings" />

        <div className="grid grid-cols-5 gap-8">
          <div className="col-span-5 xl:col-span-3">
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke px-7 py-4 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">
                  Personal Information
                </h3>
              </div>
              <div className="p-7">
                <Form form={form} onFinish={handleSubmit}>
                  <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                    <div className="w-full sm:w-1/2">
                      <label
                        className="mb-3 block text-sm font-medium text-black dark:text-white"
                        htmlFor="firstName"
                      >
                        First Name
                      </label>
                      <Form.Item
                        name="firstname"
                        rules={[
                          {
                            required: true,
                            message: "Please input your first name!",
                          },
                        ]}
                      >
                        <Input
                          className="w-full rounded border border-stroke bg-gray py-3 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                          type="text"
                          name="firstname"
                          id="firstName"
                          placeholder="John"
                        />
                      </Form.Item>
                    </div>

                    <div className="w-full sm:w-1/2">
                      <label
                        className="mb-3 block text-sm font-medium text-black dark:text-white"
                        htmlFor="lastName"
                      >
                        Last Name
                      </label>
                      <Form.Item
                        name="lastname"
                        rules={[
                          {
                            required: true,
                            message: "Please input your last name!",
                          },
                        ]}
                      >
                        <Input
                          className="w-full rounded border border-stroke bg-gray py-3 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                          type="text"
                          name="lastname"
                          id="lastName"
                          placeholder="Doe"
                        />
                      </Form.Item>
                    </div>
                  </div>

                  <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                    <div className="w-full sm:w-1/2">
                      <label
                        className="mb-3 block text-sm font-medium text-black dark:text-white"
                        htmlFor="dateOfBirth"
                      >
                        Date of Birth
                      </label>
                      <Form.Item
                        name="birthdate"
                        rules={[
                          {
                            required: true,
                            message: "Please input your birthdate!",
                          },
                        ]}
                      >
                        <DatePicker
                          id="dateOfBirth"
                          className="w-full rounded border border-stroke bg-gray py-3 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                          placeholder="01/01/2024"
                          format={"DD/MM/YYYY"}
                        />
                      </Form.Item>
                    </div>

                    <div className="w-full sm:w-1/2">
                      <label
                        className="mb-3 block text-sm font-medium text-black dark:text-white"
                        htmlFor="gender"
                      >
                        Gender
                      </label>
                      <Form.Item name="genre">
                        <Select id="gender" value={"male"} placeholder="Male">
                          <Select.Option value={"male"}>Male</Select.Option>
                          <Select.Option value={"female"}>Female</Select.Option>
                        </Select>
                      </Form.Item>
                    </div>
                  </div>

                  <div className="flex justify-end gap-4.5">
                    <button
                      className="flex justify-center rounded border border-stroke px-6 py-2 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
                      onClick={() => router.push("/dashboard")}
                    >
                      Cancel
                    </button>
                    <button
                      className="flex justify-center rounded bg-primary px-6 py-2 font-medium text-gray hover:bg-opacity-90"
                      type="submit"
                      onSubmit={form.submit}
                    >
                      Save
                    </button>
                  </div>
                </Form>
              </div>
            </div>
          </div>
          <div className="col-span-5 xl:col-span-2">
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke px-7 py-4 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">
                  Your Photo
                </h3>
              </div>
              <div className="p-7">
                <Form onFinish={handleAvatarChange}>
                  <div className="mb-4 flex items-center gap-3">
                    <div className="h-14 w-14 rounded-full">
                      <Image
                        src={user?.avatar ?? "/images/user/user-03.png"}
                        width={55}
                        height={55}
                        alt="User"
                      />
                    </div>
                    <div>
                      <span className="mb-1.5 text-black dark:text-white">
                        Edit your photo
                      </span>
                      <span className="flex gap-2.5">
                        <button className="text-sm hover:text-primary">
                          Delete
                        </button>
                        <button className="text-sm hover:text-primary">
                          Update
                        </button>
                      </span>
                    </div>
                  </div>

                  <Form.Item name={"profile_picture"}>
                    <Upload
                      accept="image/*"
                      className="h-full w-full cursor-pointer p-0"
                      fileList={fileList}
                      onPreview={handlePreview}
                      onChange={handleChange}
                      listType="picture-card"
                    >
                      {(fileList === undefined || fileList?.length === 0) && (
                        <button
                          style={{ border: 0, background: "none" }}
                          type="button"
                        >
                          <PlusOutlined />
                          <div style={{ marginTop: 8 }}>Upload</div>
                        </button>
                      )}
                    </Upload>
                    {previewImage && (
                      <Image
                        alt=""
                        wrapperStyle={{ display: "none" }}
                        preview={{
                          visible: previewOpen,
                          onVisibleChange: (visible: any) =>
                            setPreviewOpen(visible),
                          afterOpenChange: (visible: any) =>
                            !visible && setPreviewImage(""),
                        }}
                        src={previewImage}
                      />
                    )}
                  </Form.Item>

                  <div className="flex justify-end gap-4.5">
                    <Button
                      type="default"
                      className="bg-rose-500 text-white"
                      disabled={
                        fileList === undefined || fileList?.length === 0
                      }
                      onClick={handleCancel}
                    >
                      Cancel
                    </Button>
                    <Button
                      htmlType="submit"
                      type="default"
                      className="bg-sky-600 text-white"
                      disabled={
                        fileList === undefined || fileList?.length === 0
                      }
                    >
                      Save
                    </Button>
                  </div>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default Settings;
