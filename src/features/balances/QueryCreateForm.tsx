import React, { useState, useEffect } from "react";
import { Form, Input, Modal } from "antd";
import {
  Dialog,
  TextField,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
  Autocomplete,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { useSnackbar } from "notistack";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios, { AxiosError } from "axios";
import { useAppSelector, useAppDispatch } from "../../common/hooks";
import {
  selectNetworkNames,
  selectNetworksLoaded,
  fetchNetworks,
} from "../networks/networksSlice";
import { isAddress } from "@ethersproject/address";
import type { ErrorResponse, QueryForm } from "../../common/types";

interface QueryCreateFormProps {
  visible: boolean;
  onCreate: (values: QueryForm) => Promise<void>;
  onCancel: () => void;
}

// interface FormInputs {
//   address: string;
//   network: string;
//   token: string;
//   tag: string;
// }

const QueryCreateForm = ({
  visible,
  onCreate,
  onCancel,
}: QueryCreateFormProps) => {
  const dispatch = useAppDispatch();
  const networksLoaded = useAppSelector(selectNetworksLoaded);
  const networkNames = useAppSelector(selectNetworkNames);

  const navigate = useNavigate();

  const [form] = Form.useForm<QueryForm>();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessful },
  } = useForm<QueryForm>({
    mode: "onChange",
    defaultValues: { address: "", network: "Ethereum", token: "", tag: "" },
  });

  const onSubmit: SubmitHandler<QueryForm> = async (data) => {
    setSubmitting(true);
    try {
      await onCreate(data);
    } catch (error) {
      console.error(error);
      enqueueSnackbar(error as string, { variant: "error" });
    }
    setSubmitting(false);
  };

  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (!networksLoaded) {
      dispatch(fetchNetworks())
        .unwrap()
        .catch((error: string) => enqueueSnackbar(error, { variant: "error" }));
    }
  }, []);

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset({ address: "", network: "Ethereum", token: "", tag: "" });
      onCancel();
      navigate("/wallets");
    }
  }, [isSubmitSuccessful]);

  return (
    // <Modal
    //   visible={visible}
    //   title="Create a new query"
    //   okText="Create"
    //   okButtonProps={submitting ? { disabled: true, loading: true } : {}}
    //   cancelText="Cancel"
    //   onCancel={onCancel}
    //   onOk={async () => {
    //     setSubmitting(true);
    //     try {
    //       const values = await form.validateFields();
    //       await onCreate(values);
    //       form.resetFields();
    //       navigate("/wallets");
    //     } catch (error) {
    //       console.error(error);
    //       if (typeof error === "string") {
    //         enqueueSnackbar(error, { variant: "error" });
    //       }
    //     }
    //     setSubmitting(false);
    //   }}
    // >
    //   <Form
    //     form={form}
    //     layout="vertical"
    //     disabled={submitting}
    //     initialValues={{ network: "Ethereum" }}
    //   >
    //     <Form.Item
    //       name="address"
    //       label="Address"
    //       rules={[
    //         {
    //           required: true,
    //           message: "Please enter an address",
    //         },
    //         {
    //           validator: (_, value) => {
    //             if (value && !isAddress(value)) {
    //               return Promise.reject(
    //                 new Error("The input is not valid address!")
    //               );
    //             }
    //             return Promise.resolve();
    //           },
    //         },
    //       ]}
    //     >
    //       <Input allowClear />
    //     </Form.Item>
    //     <Form.Item
    //       name="network"
    //       label="Network"
    //       rules={[
    //         {
    //           required: true,
    //           message: "Please select the network for query!",
    //         },
    //       ]}
    //     >
    //       <Select
    //         showSearch
    //         placeholder="Select a network"
    //         optionFilterProp="children"
    //         filterOption={(input, option) =>
    //           (option?.children as unknown as string)
    //             .toLowerCase()
    //             .includes(input.toLowerCase())
    //         }
    //       >
    //         {networkNames.map((networkName) => (
    //           <Select.Option key={networkName} value={networkName}>
    //             {networkName}
    //           </Select.Option>
    //         ))}
    //       </Select>
    //     </Form.Item>
    //     <Form.Item
    //       name="token"
    //       label="Token"
    //       rules={[
    //         {
    //           validator: (_, value) => {
    //             if (value && !isAddress(value)) {
    //               return Promise.reject(
    //                 new Error("The input is not valid address!")
    //               );
    //             }
    //             return Promise.resolve();
    //           },
    //         },
    //       ]}
    //     >
    //       <Input allowClear placeholder="Leave empty to query native token" />
    //     </Form.Item>
    //     <Form.Item name="tag" label="Tag">
    //       <Input allowClear />
    //     </Form.Item>
    //   </Form>
    // </Modal>
    <Dialog open={visible} onClose={onCancel}>
      <DialogTitle>Create a new query</DialogTitle>
      <DialogContent>
        {/* <DialogContentText>123</DialogContentText> */}
        {/* <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField label="Address" fullWidth margin="dense" />
          </Grid>
          <Grid item xs={12}>
            <TextField label="Address" fullWidth />
          </Grid>
          <Grid item xs={12}>
            <TextField label="Address" fullWidth />
          </Grid>
        </Grid> */}
        <TextField
          label="Address"
          fullWidth
          margin="normal"
          {...register("address", {
            required: "Please enter an address",
            validate: (value) =>
              isAddress(value) || "The input is not valid address!",
          })}
          error={!!errors?.address}
          helperText={errors?.address?.message}
          required
        />
        {/* <FormControl
          fullWidth
          margin="normal"
          error={!!errors?.network}
          required
        >
          <InputLabel id="network-select-label">Network</InputLabel>
          
          <FormHelperText>{errors?.network?.message}</FormHelperText>
        </FormControl> */}
        <Controller
          name="network"
          control={control}
          rules={{ required: "Please select the network for query!" }}
          render={({ field: { ref, onChange, ...field } }) => (
            // <Select labelId="network-select-label" label="Network" {...field}>
            //   {networkNames.map((networkName) => (
            //     <MenuItem key={networkName} value={networkName}>
            //       {networkName}
            //     </MenuItem>
            //   ))}
            // </Select>
            <Autocomplete
              {...field}
              disableClearable
              onChange={(_, v) => onChange(v)}
              fullWidth
              options={networkNames}
              renderInput={(params) => (
                <TextField
                  {...params}
                  inputRef={ref}
                  label="Network"
                  // fullWidth
                  margin="normal"
                  // {...register("network", {
                  //   required: "Please select the network for query!",
                  // })}
                  inputProps={{ ...params.inputProps }}
                  error={!!errors?.network}
                  helperText={errors?.network?.message}
                  required
                />
              )}
            />
          )}
        />
        {/* <Autocomplete
          options={networkNames}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Network"
              fullWidth
              margin="normal"
              {...register("network", {
                required: "Please select the network for query!",
              })}
              error={!!errors?.network}
              helperText={errors?.network?.message}
            />
          )}
        /> */}
        <TextField
          label="Token"
          fullWidth
          margin="normal"
          placeholder="Leave empty to query native token"
          {...register("token", {
            validate: (value) =>
              !value || isAddress(value) || "The input is not valid token!",
          })}
          error={!!errors?.token}
          helperText={errors?.token?.message}
        />
        <TextField label="Tag" fullWidth margin="normal" {...register("tag")} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} sx={{ textTransform: "none" }}>
          Cancel
        </Button>
        <LoadingButton
          variant="contained"
          disableElevation
          loading={submitting}
          onClick={handleSubmit(onSubmit)}
          sx={{ textTransform: "none" }}
        >
          Create
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default QueryCreateForm;
