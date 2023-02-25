<?php

use Phalcon\Loader;
use Phalcon\Mvc\Micro;
use Phalcon\Di\FactoryDefault;
use Phalcon\Db\Adapter\Pdo\Mysql as PdoMysql;
use Phalcon\Http\Response;

$loader = new Loader();
$loader->registerNamespaces(
    [
        'App\Models' => __DIR__ . '/models/',
    ]
);
$loader->register();


$container = new FactoryDefault();
$container->set(
    'db',
    function () {
        return new PdoMysql(
            [
                'host'     => 'db',
                'username' => 'dev',
                'password' => 'plokijuh',
                'dbname'   => 'hiring',
            ]
        );
    }
);

$app = new Micro($container);

$app->get(
    '/',
    function () {
      header('Content-type: application/json');
      echo json_encode([
        'available REST endpoints:',
        'GET /api/applicants',
        'GET /api/applicants/{id}',
        'POST /api/applicants',
      ]);
    }
);

$app->get(
  '/api/applicants',
  function () use ($app) {
    $phql = "SELECT id, name, age FROM App\Models\Candidates ORDER BY age";
    $candidates = $app
      ->modelsManager
      ->executeQuery($phql)
    ;

    $data = [];

    foreach ($candidates as $cand) {
      $data[] = [
        'type' => 'applicant',
        'id'   => $cand->id,
        'attributes' => [
        'name' => $cand->name,
        'age' => $cand->age,
      ]
      ];
    }

    header('Content-type: application/vnd.api+json'); // JSON API
    echo json_encode(['data' => $data]);
  }
);

$app->post(
  '/api/applicants',
  function () use ($app) {
    $candidate = $app->request->getJsonRawBody();

    $phql = "INSERT INTO App\Models\Candidates (name, age) VALUES (:name:, :age:)";

    $status = $app
      ->modelsManager
      ->executeQuery(
        $phql,
        [
          'name' => $candidate->data->attributes->name,
          'age' => $candidate->data->attributes->age,
        ]
      );

    $response = new Response();

    if ($status->success() === true) {
      $response->setStatusCode(201, 'Created');

      $candidate->id = $status->getModel()->id;

      $response->setJsonContent(
        [
          'status' => 'OK',
          'data'   => $candidate->data,
        ]
      );
    } else {
      $response->setStatusCode(409, 'Conflict');

      $errors = [];
      foreach ($status->getMessages() as $message) {
        $errors[] = $message->getMessage();
      }

      $response->setJsonContent(
        [
          'status'   => 'ERROR',
          'messages' => $errors,
        ]
      );
    }

    return $response;
  }
);

$app->handle($_SERVER['REQUEST_URI']);
