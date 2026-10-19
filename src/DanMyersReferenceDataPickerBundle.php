<?php

declare(strict_types=1);

namespace DanMyers\ReferenceDataPickerBundle;

use Symfony\Component\HttpKernel\Bundle\Bundle;

/**
 * Modal picker for Akeneo PIM "reference data multi select" attributes:
 * search, tick several results across searches, add them at once.
 *
 * The bundle only ships frontend resources (form extensions, RequireJS
 * modules, templates, styles and translations).
 */
final class DanMyersReferenceDataPickerBundle extends Bundle
{
    public function getPath(): string
    {
        return __DIR__;
    }
}
