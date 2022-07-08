import { useState } from "react";
import { isNumber } from "lodash";
import {
  Box,
  Button,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField
} from "@mui/material";
import "./styles.css";

interface TypeValues {
  value: number;
}

const average = (values: number[]) => {
  return values.reduce((p, v) => (p += v), 0) / values.length;
};

const mediana = (values: number[]) => {
  const sorted = values.sort();
  const index = Math.floor(sorted.length / 2);
  const indexX = sorted.length / 2 - 1;
  const indexY = sorted.length / 2;

  console.log(indexX, indexY);

  return sorted.length % 2 === 0
    ? (sorted[indexX] + sorted[indexY]) / 2
    : sorted[index];
};

const moda = (values: number[]) => {
  const existingValues: Record<number, number> = {};

  values.forEach((v) => {
    existingValues[v] ? (existingValues[v] += 1) : (existingValues[v] = 1);
  });

  const result = { key: -1, value: 0, isSame: false };
  Object.entries(existingValues).forEach(([key, value]) => {
    if (values.length > 1 && value <= 1) return;

    if (value === result.value) {
      result.isSame = true;
      return;
    }

    if (value > result.value) {
      result.key = +key;
      result.value = value;
      result.isSame = false;
    }
  });

  return result.isSame || result.key === -1 ? "Amodal" : result.key;
};

const nthSqrt = (value: number, root: number) => {
  const result = Math.pow(Math.abs(value), 1 / root);

  if (value < 0 && root % 2 !== 0) return -result;
  return result;
};

const desvioPadrao = (values: number[]) => {
  const avg = average(values);

  const powValues = values.map((v) => Math.pow(v - avg, 2));
  const sum = powValues.reduce((res, v) => (res += v), 0);
  return Math.sqrt(sum / (values.length - 1));
};

const varianca = (values: number[]) => {
  const avg = average(values);

  const powValues = values.map((v) => Math.pow(v - avg, 2));
  const sum = powValues.reduce((res, v) => (res += v), 0);
  return sum / (values.length - 1);
};

const calculations = {
  average: {
    name: "Média Aritimética",
    calculation: (values: number[]) => (values.length ? average(values) : 0)
  },
  average_geometric: {
    name: "Média Geométrica",
    calculation: (values: number[]) =>
      values.length
        ? nthSqrt(
            values.reduce((p, v) => p * v, 1),
            values.length
          )
        : 0
  },
  mediana: {
    name: "Mediana",
    calculation: (values: number[]) => (values.length ? mediana(values) : 0)
  },
  moda: {
    name: "Moda",
    calculation: (values: number[]) => (values.length ? moda(values) : 0)
  },
  desvio: {
    name: "Desvio Padrão",
    calculation: (values: number[]) =>
      values.length ? desvioPadrao(values) : 0
  },
  varianca: {
    name: "Variança da Amostra",
    calculation: (values: number[]) => (values.length ? varianca(values) : 0)
  }
};

export default function App() {
  const [value, setValue] = useState("");
  const [values, setValues] = useState<TypeValues[]>([]);

  const onClickInsert = () => {
    setValues((prev) => [...prev, { value: +value }]);
    setValue("");
  };

  return (
    <div className="App">
      <h1>Estatística</h1>
      <Paper sx={{ p: 1, my: 1 }}>
        <Stack direction="row" justifyContent="center" spacing={2}>
          <TextField
            type="number"
            inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
            label="Valor"
            variant="outlined"
            onChange={(e) => setValue(e.target.value)}
            value={value}
          />
          <Button variant="contained" onClick={onClickInsert}>
            Inserir
          </Button>
        </Stack>
      </Paper>
      <Box>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="right">Valores</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {values.map((v, i) => (
                <TableRow
                  key={i}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell align="right">{v.value}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <div style={{ padding: 8 }} />
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Cálculos</TableCell>
                <TableCell align="right">Resultados</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.values(calculations).map((v) => {
                const result = v.calculation(values.map((v) => v.value));
                return (
                  <TableRow
                    key={v.name}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell>{v.name}</TableCell>
                    <TableCell align="right">
                      {isNumber(result) ? result.toFixed(4) : result}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </div>
  );
}
