import { useAuth0 } from "@auth0/auth0-react";
import { isAddress } from "@ethersproject/address";
import { AddressZero } from "@ethersproject/constants";
import LoadingButton from "@mui/lab/LoadingButton";
import Autocomplete from "@mui/material/Autocomplete";
import Button from "@mui/material/Button";
import { ButtonBaseProps } from "@mui/material/ButtonBase";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import { SnackbarKey, useSnackbar } from "notistack";
import React, { ReactNode, useEffect, useState } from "react";
import isEqual from "react-fast-compare";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../../common/hooks";
import { ErrorMessage, QueryForm } from "../../common/types";
import {
  fetchNetworks,
  selectNetworks,
  selectNetworksStatus,
} from "../networks/networksSlice";
import { addBalance } from "./balancesSlice";

interface QueryButtonProps {
  render: (params: ButtonBaseProps) => ReactNode;
}

function QueryButton({ render }: QueryButtonProps) {
  const dispatch = useAppDispatch();
  const networksStatus = useAppSelector(selectNetworksStatus);
  const networks = useAppSelector(selectNetworks);
  const { getAccessTokenSilently, user } = useAuth0();
  const [open, setOpen] = useState(false);

  const disabled = networksStatus !== "succeeded" || !user?.email_verified;

  const navigate = useNavigate();

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const action = (snackbarId: SnackbarKey) => (
    <Button
      variant="text"
      color="inherit"
      onClick={() => {
        navigate("/queries");
        closeSnackbar(snackbarId);
      }}
    >
      View
    </Button>
  );

  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessful },
  } = useForm<QueryForm>({
    mode: "onChange",
    defaultValues: {
      address: "",
      network: null,
      token: "",
    },
  });

  const onSubmit: SubmitHandler<QueryForm> = async (values) => {
    try {
      setSubmitting(true);
      const token = await getAccessTokenSilently();
      await dispatch(
        addBalance({
          token,
          values: { ...values, token: values.token || AddressZero },
        })
      ).unwrap();
      enqueueSnackbar("Query added", { variant: "success", action });
      setOpen(false);
    } catch (error) {
      enqueueSnackbar((error as ErrorMessage).message, { variant: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (networksStatus === "idle") {
      dispatch(fetchNetworks());
    }
  }, [dispatch, networksStatus]);

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset({
        address: "",
        network: null,
        token: "",
      });
    }
  }, [isSubmitSuccessful, reset]);

  return (
    <>
      {render({ disabled, onClick: () => setOpen(true) })}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
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
                // disableClearable
                onChange={(_, v) => onChange(v)}
                fullWidth
                disabled={submitting}
                options={networks}
                getOptionLabel={(option) => option.name}
                isOptionEqualToValue={isEqual}
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
          <Button disabled={submitting} onClick={() => setOpen(false)}>
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
    </>
  );
}

export default QueryButton;
