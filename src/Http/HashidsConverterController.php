<?php

namespace Pmochine\LaravelNovaHashids\Http;

use Illuminate\Http\Request;
use Vinkla\Hashids\Facades\Hashids;

class HashidsConverterController
{
	protected $config;

	public function __construct()
	{
		$this->config = config('hashids', []);
	}
	/**
	 * Gets the required information of the config file.
	 * 
	 * @param  Request $request 
	 * @return json           
	 */
	public function index() 
	{
		if(empty($this->config)){
			return response()->json([
				'status' => 'empty',
			]);
		}

		return response()->json([
			'status' => 'loaded',
			'default' => $this->config['default'],
			'selection' => array_keys($this->config['connections'])
		]);
	}

	/**
	 * Converts modelId or Hashid
	 * @param  Request $request 
	 * @return json           
	 */
	public function convert(Request $request) 
	{
		$request->validate([
			'selected' => 'required'
		]);

		if(! array_has($this->config, 'connections.'.$request->selected)){
			return abort(422);
		}

		if(is_null($request->modelId) && is_null($request->hashId)){
			return response()->json([
				'status' => 'empty',
			]);
		}

		if(is_null($request->modelId)){
			return response()->json([
				'status' => 'modelId',
				'value' => Hashids::connection($request->selected)
						  			->decode($request->hashId)[0]
			]);
		}

		return response()->json([
			'status' => 'hashId',
			'value' => Hashids::connection($request->selected)
					  			->encode($request->modelId)
		]);
	}
}
