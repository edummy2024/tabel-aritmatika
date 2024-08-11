import { useState } from 'react';
import './App.css';

export default function App() {
  const [value, setValue] = useState<number>(10);
  const [operator, setOperator] = useState<'tambah' | 'kurang' | 'bagi' | 'kali'>('kali');

  function generateTitle(n: number) {
    if (operator === 'tambah') {
      return `Pertambahan ${n}`;
    } else if (operator === 'bagi') {
      return `Pembagian ${n}`;
    } else if (operator === 'kali') {
      return `perkalian ${n}`;;
    } else if (operator === 'kurang') {
      return `Pengurangan ${n}`;
    }
  }

  function calculate(x: number, y: number) {
    if (operator === 'tambah') {
      return x + y;
    } else if (operator === 'bagi') {
      return (x / y).toFixed(2);
    } else if (operator === 'kali') {
      return x * y;
    } else if (operator === 'kurang') {
      return x - y;
    }
  }

  function generateDataTable() {
    const operators = [
      {
        value: 'tambah',
        label: '+',
      },
      {
        value: 'kurang',
        label: '-',
      },
      {
        value: 'bagi',
        label: ':',
      },
      {
        value: 'kali',
        label: '*',
      },
    ];
    const valuesLeft = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    if (value <= 100) {
      return Array.from({ length: value }).fill(null)
        .map((_, index) => {
          const title = generateTitle(index + 1);
          const symbolOperator = operators.find((o) => o.value === operator as string)?.label;

          const data = valuesLeft.map((n) => ({
            valueLeft: n,
            valueRight: index + 1,
            operator: symbolOperator,
            result: calculate(n, (index + 1)),
          }));

          return {
            title,
            data,
          };
        });
    }

    const title = generateTitle(value);
    const symbolOperator = operators.find((o) => o.value === operator as string)?.label;
    const data = valuesLeft.map((n) => ({
      valueLeft: n,
      valueRight: value,
      operator: symbolOperator,
      result: calculate(n, value),
    }));

    return [{
      title,
      data,
    }];
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const limit = Number(formData.get('limit'));
    const operator = formData.get('operator');

    if (limit > 1000000000) {
      alert('value must be 0 - 1.000.000.000');
      return;
    }

    setValue(limit);
    if (operator) {
      setOperator(operator as "tambah" | "kurang" | "bagi" | "kali");
    }
  }

  return (
    <main className='container'>
      <Form onSubmit={onSubmit}/>
      <div className="table-container">
        {
          generateDataTable().map((data) => (
            <table border={1} key={data.title}>
              <thead>
                <tr>
                  <th>{data.title}</th>
                  <th>Hasil</th>
                </tr>
              </thead>
              <tbody>
                {
                  data.data.map((childItem, childIndex) => (
                    <tr key={childIndex}>
                      <td>
                        {`${childItem.valueLeft} ${childItem.operator} ${childItem.valueRight} = `}
                      </td>
                      <td key={childIndex}>
                        {childItem.result}
                      </td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          ))
        }
      </div>
    </main>
  )
}

type Form = {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

function Form({ onSubmit }: Form) {
  const operators = [
    {
      value: 'tambah',
      label: '+',
    },
    {
      value: 'kurang',
      label: '-',
    },
    {
      value: 'bagi',
      label: ':',
    },
    {
      value: 'kali',
      label: '*',
    },
  ];

  const optionsOperator = operators.map((operator) => (
    <option key={operator.value} value={operator.value}>{operator.label}</option>
  ));

  return (
    <form
      onSubmit={onSubmit}
      className="input-user-container"
    >
      <div className="input-user">
        <label htmlFor="limit">Batas Maksimal</label>
        <input
          name="limit"
          type="number"
          defaultValue={10}          
        />
      </div>
      <div className="input-user">
        <label htmlFor="operator">Pilih Operator</label>
        <select id="operator" name="operator" defaultValue={'kali'}>
          {optionsOperator}
        </select>
      </div>
      <div>
        <button type="submit">generate table</button>
      </div>
    </form>
  )
}
