import React, { useState, useEffect } from "react";
import {
  Dialog,
  TextField,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Autocomplete,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { useSnackbar } from "notistack";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { useAppSelector, useAppDispatch } from "../../common/hooks";
import {
  selectNetworkNames,
  selectNetworksStatus,
  fetchNetworks,
} from "../networks/networksSlice";
import { isAddress } from "@ethersproject/address";
import type { QueryForm } from "../../common/types";

interface QueryCreateFormProps {
  visible: boolean;
  onCreate: (values: QueryForm) => Promise<void>;
  onCancel: () => void;
}

const QueryCreateForm = ({
  visible,
  onCreate,
  onCancel,
}: QueryCreateFormProps) => {
  const dispatch = useAppDispatch();
  const networksStatus = useAppSelector(selectNetworksStatus);
  const networkNames = useAppSelector(selectNetworkNames);

  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessful },
  } = useForm<QueryForm>({
    mode: "onChange",
    defaultValues: { address: "", network: "Ethereum", token: "" },
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
    if (networksStatus === "idle") {
      dispatch(fetchNetworks());
    }
  }, []);

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset({ address: "", network: "Ethereum", token: "" });
      onCancel();
    }
  }, [isSubmitSuccessful]);

  return (
    <Dialog open={visible} onClose={onCancel} fullWidth>
      <DialogTitle>Create a new query</DialogTitle>
      <DialogContent>
        <TextField
          label="Address"
          fullWidth
          margin="normal"
          disabled={submitting}
          {...register("address", {
            required: "Please enter an address",
            validate: (value) =>
              isAddress(value) || "The input is not valid address!",
          })}
          error={!!errors?.address}
          helperText={errors?.address?.message}
          required
        />
        <Controller
          name="network"
          control={control}
          rules={{ required: "Please select the network for query!" }}
          render={({ field: { ref, onChange, ...field } }) => (
            <Autocomplete
              {...field}
              disableClearable
              onChange={(_, v) => onChange(v)}
              fullWidth
              disabled={submitting}
              options={networkNames}
              renderInput={(params) => (
                <TextField
                  {...params}
                  inputRef={ref}
                  label="Network"
                  margin="normal"
                  inputProps={{ ...params.inputProps }}
                  error={!!errors?.network}
                  helperText={errors?.network?.message}
                  required
                />
              )}
            />
          )}
        />
        <TextField
          label="Token"
          fullWidth
          margin="normal"
          disabled={submitting}
          placeholder="Leave empty to query native token"
          {...register("token", {
            validate: (value) =>
              !value || isAddress(value) || "The input is not valid token!",
          })}
          error={!!errors?.token}
          helperText={errors?.token?.message}
        />
      </DialogContent>
      <DialogActions>
        <Button disabled={submitting} onClick={onCancel}>
          Cancel
        </Button>
        <LoadingButton
          variant="contained"
          disableElevation
          loading={submitting}
          onClick={handleSubmit(onSubmit)}
        >
          Create
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default QueryCreateForm;
