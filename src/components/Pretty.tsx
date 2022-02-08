/* eslint-disable no-console */
import React, { useState } from 'react';
import JSONPretty from 'react-json-pretty';

interface PrettyProps {
  yourData: Record<string, unknown>;
  idDefined?: string;
}

function Pretty({ yourData, idDefined = 'json-pretty' }: PrettyProps) {
  const [errorMessage, setErrorMessage] = useState<Error | null>(null);

  return (
    <div>
      {!errorMessage ? (
        <JSONPretty
          id={idDefined}
          data={yourData}
          onJSONPrettyError={(e) => {
            console.error('onJSONPrettyError:', e);
            setErrorMessage(e);
          }}
          theme={{
            main: 'line-height:1.3;color:#66d9ef;background:#272822;overflow:auto;',
            error: 'line-height:1.3;color:#66d9ef;background:#272822;overflow:auto;',
            key: 'color:#f92672;',
            string: 'color:#fd971f;',
            value: 'color:#a6e22e;',
            boolean: 'color:#ac81fe;',
          }}
        />
      ) : (
        <JSONPretty
          id={idDefined}
          data={errorMessage}
          onJSONPrettyError={(e) => {
            console.error('onJSONPrettyError:', e);
          }}
        />
      )}
    </div>
  );
}

Pretty.defaultProps = {
  idDefined: 'json-pretty',
};

export default Pretty;
