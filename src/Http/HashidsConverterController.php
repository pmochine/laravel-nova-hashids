<?php

namespace Pmochine\LaravelNovaHashids\Http;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Pmochine\LaravelNovaHashids\Contracts\Converter;

class HashidsConverterController
{
    public function __construct(protected Converter $converter)
    {
    }

    /**
     * Get the connections the card can select.
     */
    public function index(): JsonResponse
    {
        return response()->json([
            'connections' => $this->converter->connections(),
            'default' => $this->converter->defaultConnection(),
        ]);
    }

    /**
     * Convert a model id to a hashid, or a hashid to a model id.
     *
     * If the request contains both values, the model id wins.
     */
    public function convert(Request $request): JsonResponse
    {
        $data = $request->validate([
            'connection' => ['required', 'string', Rule::in($this->converter->connections())],
            'modelId' => ['nullable', 'required_without:hashId', 'regex:/^\d{1,20}$/'],
            'hashId' => ['nullable', 'required_without:modelId', 'string', 'max:255'],
        ], [
            'required_without' => 'Enter a hashid or a model id.',
            'modelId.regex' => 'The model id must be a positive whole number.',
        ]);

        if (isset($data['modelId'])) {
            $modelId = (string) $data['modelId'];
            $hashId = $this->converter->encode($data['connection'], $modelId);

            if ($hashId === null) {
                throw ValidationException::withMessages([
                    'modelId' => 'The selected connection can not encode this model id.',
                ]);
            }
        } else {
            $hashId = $data['hashId'];
            $modelId = $this->converter->decode($data['connection'], $hashId);

            if ($modelId === null) {
                throw ValidationException::withMessages([
                    'hashId' => 'This hashid is not valid for the selected connection.',
                ]);
            }
        }

        return response()->json([
            'hashId' => $hashId,
            'modelId' => $modelId,
        ]);
    }
}
